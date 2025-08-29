import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useGetFilteredLevels, useGetLevels } from 'src/api/levels';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import axiosInstance from 'src/utils/axios';
import { LoadingButton } from '@mui/lab';
import { paths } from 'src/routes/paths';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import EscalationMatrixLayout from '../escalation-matrix-layout';
import AddMemberNewEditForm from '../add-member-new-edit-form';
import AddLevelNewForm from '../add-level-new';


export default function NotificationSettingListView() {
  const params = useParams();
  const { id } = params;
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const filter  = {
    where: {
      escalationId: Number(id)
    }
  };
  const filterString = encodeURIComponent(JSON.stringify(filter));
  const { levels, count, refreshLevels } = useGetFilteredLevels(filterString);
  const [openLevelDialog, setOpenLevelDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);

  const handleOpenLevel = () => setOpenLevelDialog(true);
  const handleCloseLevel = () => setOpenLevelDialog(false);

  const [isAddingLevel, setIsAddingLevel] = useState(false);

  const [currentMember , setCurrentMember]= useState(null)

const handleEditMember = (member) => {
  setCurrentMember(member); // set selected member
  setOpenMemberDialog(true); // open dialog in edit mode
};
  const handleOpenMember = () => setOpenMemberDialog(true);
  const handleCloseMember = () => setOpenMemberDialog(false);

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  const handleAddLevel = async () => {
    setIsAddingLevel(true);
    console.log('id', id);
    try {
      const inputData = {
        name: `Level ${count + 1}`,
        description: 'New level description',
        escalationId: Number(id),
      };

      const response = await axiosInstance.post('/levels', inputData);

      if (response.data) {
        enqueueSnackbar('Level added successfully!', { variant: 'success' });
        refreshLevels();
      }
    } catch (error) {
      console.error('Failed to add level:', error);
      enqueueSnackbar('Failed to add level', { variant: 'error' });
    } finally {
      setIsAddingLevel(false);
    }
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Escalation Matrix', href: paths.dashboard.notificationSetting.list },
            { name: 'List' },
          ]}
          sx={{
            mb: 3,
            px: 2,
          }}
          action={
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end', 
                width: '100%',             
              }}
            >
              <LoadingButton
                variant="outlined"
                loading={isAddingLevel}
                onClick={handleAddLevel}
                sx={{
                  borderRadius: '30px',
                  backgroundColor: '#4182EB',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  height: 40,
                  '&:hover': {
                    backgroundColor: '#3069c6',
                  },
                }}
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Add Level
              </LoadingButton>

              <Button
                variant="outlined"
                onClick={handleOpenMember}
                sx={{
                  borderRadius: '30px',
                  backgroundColor: '#4182EB',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  height: 40,
                  '&:hover': {
                    backgroundColor: '#3069c6',
                  },
                }}
                startIcon={<Iconify icon="eva:person-add-fill" />}
              >
                Add Member
              </Button>
            </Box>
          }
        />


        {/* Content */}
        <EscalationMatrixLayout levels={levels} refreshLevels={refreshLevels}  onEditMember={handleEditMember}/>
      </Container>


      {/* Dialogs */}
      <AddLevelNewForm
        open={openLevelDialog}
        onClose={handleCloseLevel}
        onSubmitForm={handleSubmit}
        refreshLevels={refreshLevels}
      />

      <AddMemberNewEditForm
        open={openMemberDialog}
        onClose={handleCloseMember}
        onSubmitForm={handleSubmit}
        refreshLevels={refreshLevels}
        currentMember={currentMember}
      />
    </>
  );
}
