import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton,
  Button, 
  TextField,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { getTemplateById, getTemplateImages } from '../templates';

interface TemplateImageSelectorProps {
  templateId: string;
  onImageSelect?: (imagePath: string) => void;
  editable?: boolean;
}

const TemplateImageSelector: React.FC<TemplateImageSelectorProps> = ({ 
  templateId, 
  onImageSelect,
  editable = false
}) => {
  const [images, setImages] = useState<Array<{
    id: string;
    name: string;
    path: string;
    usage: string;
    dimensions?: string;
  }>>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState<boolean>(false);
  const [newImageName, setNewImageName] = useState<string>('');
  const [newImageUsage, setNewImageUsage] = useState<string>('');

  useEffect(() => {
    if (templateId) {
      // Get template images from the templates service
      const templateImages = getTemplateImages(templateId);
      setImages(templateImages);
    }
  }, [templateId]);

  const handleImageClick = (path: string) => {
    setSelectedImage(path);
    setShowDialog(true);
    if (onImageSelect) {
      onImageSelect(path);
    }
  };

  const handleAddImage = () => {
    setUploadDialogOpen(true);
  };

  const handleCloseUpload = () => {
    setUploadDialogOpen(false);
    setNewImageName('');
    setNewImageUsage('');
  };

  const handleSaveNewImage = () => {
    // In a real application, this would upload the file and add it to the template
    alert('In a production app, this would upload and save the new image.');
    handleCloseUpload();
  };

  const templateInfo = getTemplateById(templateId);

  if (!templateInfo) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Template not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Images for {templateInfo.name}
        </Typography>
        {editable && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={handleAddImage}
          >
            Add Image
          </Button>
        )}
      </Box>

      {images.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="body1" color="text.secondary">
            No images found for this template.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Path</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Usage</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Dimensions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {images.map((image) => (
                  <TableRow 
                    key={image.id}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { 
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => handleImageClick(image.path)}
                  >
                    <TableCell>{image.name}</TableCell>
                    <TableCell 
                      sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {image.path}
                    </TableCell>
                    <TableCell>{image.usage}</TableCell>
                    <TableCell>{image.dimensions || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
            Click on any image to view it
          </Typography>

          <Grid container spacing={2}>
            {images.map((image) => (
              <Grid item xs={6} sm={4} md={3} key={image.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => handleImageClick(image.path)}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={image.path}
                    alt={image.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ py: 1 }}>
                    <Typography variant="body2" noWrap>
                      {image.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Image Preview Dialog */}
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Image Preview
          <IconButton
            aria-label="close"
            onClick={() => setShowDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedImage && (
            <Box sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                src={selectedImage}
                alt="Selected template image"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  mb: 2
                }}
              />
              <Typography variant="subtitle1">
                {selectedImage.split('/').pop()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Path: {selectedImage}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={handleCloseUpload}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Image</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Image Name"
              value={newImageName}
              onChange={(e) => setNewImageName(e.target.value)}
              margin="normal"
              variant="outlined"
              placeholder="e.g., Hero Background"
            />
            
            <TextField
              fullWidth
              label="Usage Description"
              value={newImageUsage}
              onChange={(e) => setNewImageUsage(e.target.value)}
              margin="normal"
              variant="outlined"
              placeholder="e.g., Background image for hero section"
              multiline
              rows={2}
            />
            
            <Box sx={{ mt: 3, p: 2, border: '1px dashed grey', borderRadius: 1, textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                component="label"
              >
                Select Image File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                />
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Supported formats: JPG, PNG, SVG, WebP
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button onClick={handleCloseUpload} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveNewImage}
            disabled={!newImageName || !newImageUsage}
          >
            Save Image
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default TemplateImageSelector; 