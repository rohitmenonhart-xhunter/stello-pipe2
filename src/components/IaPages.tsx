import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WebIcon from '@mui/icons-material/Web';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface IaPagesProps {
  selectedPages: string[];
  onNext: () => void;
  onUpdateNotes: (pageNotes: Record<string, string>) => void;
}

export const IaPages: React.FC<IaPagesProps> = ({ 
  selectedPages,
  onNext,
  onUpdateNotes
}) => {
  const theme = useTheme();
  
  // Initialize notes for each page
  const [pageNotes, setPageNotes] = useState<Record<string, string>>({});
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  useEffect(() => {
    // Initialize empty notes for each page if not already set
    const initialNotes: Record<string, string> = {};
    selectedPages.forEach(page => {
      initialNotes[page] = pageNotes[page] || '';
    });
    setPageNotes(initialNotes);
  }, [selectedPages]);

  const handleEditNote = (page: string) => {
    setEditingPage(page);
    setTempNote(pageNotes[page] || '');
  };

  const handleSaveNote = (page: string) => {
    const updatedNotes = {
      ...pageNotes,
      [page]: tempNote
    };
    setPageNotes(updatedNotes);
    setEditingPage(null);
    
    // Notify parent component about notes update
    onUpdateNotes(updatedNotes);
  };

  const handleContinue = () => {
    onUpdateNotes(pageNotes);
    onNext();
  };

  return (
    <Box className="fade-in">
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          mb: 4
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6200EA, #B388FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3
          }}
        >
          Information Architecture
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            color: theme.palette.text.secondary 
          }}
        >
          Below are the pages you've selected for your website. You can add notes for each page to specify 
          additional requirements or content ideas. These notes will help us create a better website tailored to your needs.
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <List>
            {selectedPages.map((page, index) => (
              <Accordion
                key={page}
                disableGutters
                elevation={0}
                sx={{
                  mb: 2,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: '8px !important',
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: 0,
                    mb: 2,
                  }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: '8px',
                    '&.Mui-expanded': {
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }
                  }}
                >
                  <ListItemIcon>
                    <WebIcon sx={{ color: theme.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={page} 
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: theme.palette.text.primary
                    }}
                  />
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  {editingPage === page ? (
                    <Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        placeholder="Add your notes, requirements or content ideas for this page..."
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <Button
                        startIcon={<SaveIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveNote(page)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Save Notes
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      {pageNotes[page] ? (
                        <Box sx={{ mb: 2 }}>
                          <Typography 
                            variant="subtitle2" 
                            component="div"
                            sx={{ 
                              fontWeight: 600, 
                              mb: 1,
                              color: theme.palette.text.secondary
                            }}
                          >
                            Your Notes:
                          </Typography>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              backgroundColor: alpha(theme.palette.background.default, 0.5),
                              borderRadius: 2,
                              borderLeft: `4px solid ${theme.palette.primary.main}`
                            }}
                          >
                            <Typography variant="body2">
                              {pageNotes[page]}
                            </Typography>
                          </Paper>
                        </Box>
                      ) : (
                        <Typography 
                          variant="body2" 
                          color="textSecondary"
                          sx={{ fontStyle: 'italic', mb: 2 }}
                        >
                          No notes added yet.
                        </Typography>
                      )}
                      <Button
                        startIcon={<EditIcon />}
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditNote(page)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none'
                        }}
                      >
                        {pageNotes[page] ? 'Edit Notes' : 'Add Notes'}
                      </Button>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </Box>
      </Paper>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 4,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          background: alpha(theme.palette.primary.light, 0.1),
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 600
          }}
        >
          Ready to proceed to template selection?
        </Typography>
        
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleContinue}
          sx={{
            py: 1.5,
            px: 5,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '1.1rem',
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(98, 0, 234, 0.6)',
            background: 'linear-gradient(90deg, #6200EA, #B388FF)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(98, 0, 234, 0.7)',
              background: 'linear-gradient(90deg, #5000D6, #A370FF)',
              transform: 'translateY(-3px)',
            }
          }}
        >
          Next: Select Template
        </Button>
      </Paper>
    </Box>
  );
}; 