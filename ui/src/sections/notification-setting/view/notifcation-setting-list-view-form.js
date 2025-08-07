import { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import { HexagonLevel } from 'src/components/level-cards';
import AddMemberNewEditForm from '../add-member-new-edit-form';
import AddLevelNewForm from '../add-level-new';
import MemberItemHorizontal from '../member-details-horizontal';

export default function NotificationSettingListView() {
  const settings = useSettingsContext();

  // Dummy levels JSON array
  const levels = [
    {
      id: 1,
      name: 'Level 1',
      description: 'Primary contact',
      members: [
        {
          id: 101,
          name: 'Alice Smith',
          email: 'alice@example.com',
          phone: '+91 9876543210',
        },
      ],
    },
    {
      id: 2,
      name: 'Level 2',
      description: 'Secondary contact',
      members: [
        {
          id: 102,
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '+91 9123456789',
        },
        {
          id: 103,
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          phone: '+91 9012345678',
        },
      ],
    },
    {
      id: 3,
      name: 'Level 3',
      description: 'Tertiary backup',
      members: [],
    },
     {
      id: 4,
      name: 'Level 4',
      description: 'Tertiary backup',
      members: [],
    },
     {
      id: 5,
      name: 'Level 5',
      description: 'Tertiary backup',
      members: [],
    },
  ];

  const [openLevelDialog, setOpenLevelDialog] = useState(false);
  const handleOpenLevel = () => setOpenLevelDialog(true);
  const handleCloseLevel = () => setOpenLevelDialog(false);

  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const handleOpenMember = () => setOpenMemberDialog(true);
  const handleCloseMember = () => setOpenMemberDialog(false);

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Box
          sx={{
            mb: 3,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h4" component="h1" fontWeight={600}>
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

      
        <HexagonLevel levels={levels} />
        {/* <MemberItemHorizontal/> */}
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


