// // src/pages/LanguagePage.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Typography, Button, Paper, Radio } from '@mui/material';
// import { useTranslation } from 'react-i18next';

// const LanguagePage = () => {
//   const { t, i18n } = useTranslation();
//   const navigate = useNavigate();
//   const [selectedLang, setSelectedLang] = useState('en');

//   const handleSelect = (lang) => {
//     setSelectedLang(lang);
//     i18n.changeLanguage(lang);
//   };

//   return (
//     <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 5 }}>
//       <Box sx={{ height: 80, backgroundColor: 'green', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//         <Typography color="white" variant="h5">LOGO</Typography>
//       </Box>

//       <Typography variant="h5" color="green" mt={4}>{t('welcome')}</Typography>
//       <Typography mt={1}>{t('selectLanguage')}</Typography>

//       <Box mt={4} width="80%">
//         {['en', 'ta'].map((lang) => (
//           <Paper
//             key={lang}
//             sx={{
//               mb: 2,
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               padding: 1.5,
//               backgroundColor: selectedLang === lang ? '#d4edc9' : '#f5f5f5',
//               borderRadius: 2,
//               cursor: 'pointer'
//             }}
//             onClick={() => handleSelect(lang)}
//           >
//             <Typography>
//               {lang === 'en' ? 'English' : 'தமிழ்'}
//             </Typography>
//             <Radio checked={selectedLang === lang} />
//           </Paper>
//         ))}
//       </Box>

//       <Button
//         variant="contained"
//         sx={{
//           mt: 'auto',
//           mb: 4,
//           backgroundColor: 'green',
//           borderRadius: '25px',
//           width: '80%',
//           height: 50,
//           fontWeight: 'bold',
//           fontSize: '16px'
//         }}
//         onClick={() => navigate('/signup')}
//       >
//         {t('start')}
//       </Button>
//     </Box>
//   );
// };

// export default LanguagePage;


// src/pages/LanguagePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Radio } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguagePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = React.useState('en');

  const handleSelect = (lang) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang); // Save to storage
  };

  const handleStart = () => {
    if (selectedLang) {
      navigate('/signup');
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 5 }}>
      <Box sx={{ height: 80, backgroundColor: 'green', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography color="white" variant="h5">LOGO</Typography>
      </Box>

      <Typography variant="h5" color="green" mt={4}>{t('welcome')}</Typography>
      <Typography mt={1}>{t('selectLanguage')}</Typography>

      <Box mt={4} width="80%">
        {['en', 'ta'].map((lang) => (
          <Paper
            key={lang}
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 1.5,
              backgroundColor: selectedLang === lang ? '#d4edc9' : '#f5f5f5',
              borderRadius: 2,
              cursor: 'pointer'
            }}
            onClick={() => handleSelect(lang)}
          >
            <Typography>
              {lang === 'en' ? 'English' : 'தமிழ்'}
            </Typography>
            <Radio checked={selectedLang === lang} />
          </Paper>
        ))}
      </Box>

      <Button
        variant="contained"
        sx={{
          mt: 'auto',
          mb: 4,
          backgroundColor: 'green',
          borderRadius: '25px',
          width: '80%',
          height: 50,
          fontWeight: 'bold',
          fontSize: '16px'
        }}
        onClick={handleStart}
      >
        {t('start')}
      </Button>
    </Box>
  );
};

export default LanguagePage;
