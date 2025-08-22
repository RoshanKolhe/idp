import { useMemo, useState } from 'react';
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
import EscalationMatrixLayout from '../escalation-matrix-layout';
import AddMemberNewEditForm from '../add-member-new-edit-form';
import AddLevelNewForm from '../add-level-new';

export default function NotificationSettingListView() {
  const settings = useSettingsContext();

 const{levels}= useGetLevels();
  const [openLevelDialog, setOpenLevelDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);

  const handleOpenLevel = () => setOpenLevelDialog(true);
  const handleCloseLevel = () => setOpenLevelDialog(false);

  const handleOpenMember = () => setOpenMemberDialog(true);
  const handleCloseMember = () => setOpenMemberDialog(false);

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* Header */}
        <Box
          sx={{
            mb: 3,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h4" fontWeight={600}>
            Escalation Matrix
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleOpenLevel}
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
            </Button>

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
        </Box>

        {/* Content: Loading / Empty / Display */}
        

         <EscalationMatrixLayout levels={levels} />
      </Container>

      {/* Dialogs */}
      <AddLevelNewForm
        open={openLevelDialog}
        onClose={handleCloseLevel}
        onSubmitForm={handleSubmit}
      />

      <AddMemberNewEditForm
        open={openMemberDialog}
        onClose={handleCloseMember}
        onSubmitForm={handleSubmit}
      />
    </>
  );
}
