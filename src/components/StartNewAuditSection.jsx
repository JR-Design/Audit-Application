import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, 
         DialogContent, DialogContentText, DialogActions, TextField, Box, IconButton } from "@mui/material";
import initialAuditTemplates from '../data/initialAuditTemplates';
import { v4 as uuidv4 } from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StartNewAuditSection = ({ onAuditCreated }) => {
    const [startNewAuditDialogOpen, setStartNewAuditDialogOpen] = useState(false);
    const [selectedAuditTemplateForNewAudit, setSelectedAuditTemplateForNewAudit] = useState(null);
    const [newAuditName, setNewAuditName] = useState('');
    const [showAllTemplates, setShowAllTemplates] = useState(false);
    
    // Custom template state
    const [customTemplates, setCustomTemplates] = useState(() => {
        const saved = localStorage.getItem('customTemplates');
        return saved ? JSON.parse(saved) : [];
    });
    const [isCreatingNewTemplate, setIsCreatingNewTemplate] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [newTemplateSections, setNewTemplateSections] = useState([{ 
        id: uuidv4(), 
        name: '', 
        items: [{ id: uuidv4(), text: '' }] 
    }]);

    useEffect(() => {
        localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
    }, [customTemplates]);

    const handleStartNewAudit = (template) => {
        setSelectedAuditTemplateForNewAudit(template);
        setNewAuditName('');
        setStartNewAuditDialogOpen(true);
    };

    const handleConfirmStartNewAudit = () => {
        if (!selectedAuditTemplateForNewAudit) return;

        const newAuditInstance = {
            auditInstanceId: uuidv4(),
            name: newAuditName.trim() || `${selectedAuditTemplateForNewAudit.name} Audit`,
            templateName: selectedAuditTemplateForNewAudit.name,
            status: 'in-progress',
            templateId: selectedAuditTemplateForNewAudit.id,
            checklist: selectedAuditTemplateForNewAudit.checklist.map(item => ({
                ...item,
                checked: false,
                comment: "",
                addComment: false,
                completionTimestamp: null
            })),
            progress: 0,
            dateCreated: new Date().toISOString(),
            dateCompleted: null,
        };
        
        onAuditCreated(newAuditInstance);
        setStartNewAuditDialogOpen(false);
        setSelectedAuditTemplateForNewAudit(null);
        setNewAuditName('');
    };

    const handleCancelStartNewAuditDialog = () => {
        setStartNewAuditDialogOpen(false);
        setSelectedAuditTemplateForNewAudit(null);
        setNewAuditName('');
    };

    // Template creation handlers
    const handleAddSection = () => {
        setNewTemplateSections([...newTemplateSections, {
            id: uuidv4(),
            name: '',
            items: [{ id: uuidv4(), text: '' }]
        }]);
    };

    const handleRemoveSection = (sectionIndex) => {
        const updatedSections = newTemplateSections.filter((_, index) => index !== sectionIndex);
        setNewTemplateSections(updatedSections);
    };

    const handleAddItem = (sectionIndex) => {
        const updatedSections = [...newTemplateSections];
        updatedSections[sectionIndex].items.push({
            id: uuidv4(),
            text: ''
        });
        setNewTemplateSections(updatedSections);
    };

    const handleRemoveItem = (sectionIndex, itemIndex) => {
        const updatedSections = [...newTemplateSections];
        updatedSections[sectionIndex].items = updatedSections[sectionIndex].items.filter((_, index) => index !== itemIndex);
        setNewTemplateSections(updatedSections);
    };

    const handleSectionNameChange = (sectionIndex, value) => {
        const updatedSections = [...newTemplateSections];
        updatedSections[sectionIndex].name = value;
        setNewTemplateSections(updatedSections);
    };

    const handleItemChange = (sectionIndex, itemIndex, value) => {
        const updatedSections = [...newTemplateSections];
        updatedSections[sectionIndex].items[itemIndex].text = value;
        setNewTemplateSections(updatedSections);
    };

    const handleSaveNewTemplate = () => {
        if (!newTemplateName.trim() || 
            newTemplateSections.some(section => 
                !section.name.trim() || 
                section.items.some(item => !item.text.trim())
            )) {
            alert('Please fill in all required fields');
            return;
        }

        const checklist = newTemplateSections.flatMap(section => 
            section.items.map(item => ({
                id: uuidv4(),
                text: item.text,
                category: section.name,
                checked: false,
                comment: "",
                addComment: false,
                completionTimestamp: null
            }))
        );

        const newTemplate = {
            id: uuidv4(),
            name: newTemplateName,
            checklist: checklist
        };

        setCustomTemplates([...customTemplates, newTemplate]);
        setIsCreatingNewTemplate(false);
        setNewTemplateName('');
        setNewTemplateSections([{ 
            id: uuidv4(), 
            name: '', 
            items: [{ id: uuidv4(), text: '' }] 
        }]);
    };

    const allTemplates = [...initialAuditTemplates, ...customTemplates];
    // Display blank template + first 5 templates by default
    const visibleTemplates = showAllTemplates ? allTemplates : allTemplates.slice(0, 5);

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">
                    Start New Audit
                </Typography>
                
                {allTemplates.length > 5 && (
                    <Button 
                        color="primary" 
                        onClick={() => setShowAllTemplates(!showAllTemplates)}
                        endIcon={<KeyboardArrowDownIcon />}
                    >
                        {showAllTemplates ? "Show fewer templates" : "Show all templates"}
                    </Button>
                )}
            </Box>

            <Grid container spacing={2}>
                {/* Blank template is always shown */}
                <Grid item xs={4} sm={4} md={2}>
                    <Card 
                        sx={{ 
                            height: '100%', 
                            backgroundColor: 'secondary.main', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                        onClick={() => setIsCreatingNewTemplate(true)}
                    >
                        <CardContent 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%' 
                            }}
                        >
                            <AddIcon color="white" sx={{ fontSize: 48, color: 'white' }} />
                            <Typography 
                                variant="subtitle2" 
                                sx={{ color: 'white', textAlign: 'center' }}
                            >
                                Blank Template
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Display limited or all templates based on showAllTemplates state */}
                {visibleTemplates.map((template) => (
                    <Grid item xs={4} sm={4} md={2} key={template.id}>
                        <Card 
                            sx={{ 
                                height: '100%', 
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                                '&:active': {
                                    transform: 'scale(0.98)',
                                }
                            }}
                            onClick={() => handleStartNewAudit(template)}
                        >
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Typography variant="subtitle1" sx={{ flexShrink: 0 }}>
                                    {template.name}
                                </Typography>
                                
                                <div style={{ flexGrow: 1 }} />
                                
                                <Button
                                    color="primary"
                                    onClick={(e) => { 
                                        e.stopPropagation();
                                        handleStartNewAudit(template); 
                                    }}
                                    sx={{ alignSelf: 'flex-center', mb: 2 }}
                                >
                                    <Typography variant="button">
                                        Create New
                                    </Typography>
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* New Template Dialog */}
            <Dialog open={isCreatingNewTemplate} onClose={() => setIsCreatingNewTemplate(false)} fullWidth maxWidth="md">
                <DialogTitle>Create New Audit Template</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Template Name"
                        fullWidth
                        value={newTemplateName}
                        onChange={(e) => setNewTemplateName(e.target.value)}
                        required
                    />

                    {newTemplateSections.map((section, sectionIndex) => (
                        <Box key={section.id} sx={{ mt: 3, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TextField
                                    margin="dense"
                                    label="Section Name"
                                    fullWidth
                                    value={section.name}
                                    onChange={(e) => handleSectionNameChange(sectionIndex, e.target.value)}
                                    required
                                />
                                <IconButton 
                                    onClick={() => handleRemoveSection(sectionIndex)}
                                    color="error"
                                    disabled={newTemplateSections.length === 1}
                                >
                                    <RemoveIcon />
                                </IconButton>
                            </Box>

                            {section.items.map((item, itemIndex) => (
                                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                                    <TextField
                                        margin="dense"
                                        label={`Checklist Item ${itemIndex + 1}`}
                                        fullWidth
                                        value={item.text}
                                        onChange={(e) => handleItemChange(sectionIndex, itemIndex, e.target.value)}
                                        required
                                    />
                                    <IconButton 
                                        onClick={() => handleRemoveItem(sectionIndex, itemIndex)}
                                        color="error"
                                        disabled={section.items.length === 1}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </Box>
                            ))}

                            <Button 
                                startIcon={<AddIcon />} 
                                onClick={() => handleAddItem(sectionIndex)}
                                sx={{ mt: 1 }}
                            >
                                Add Item
                            </Button>
                        </Box>
                    ))}

                    <Button 
                        startIcon={<AddIcon />} 
                        onClick={handleAddSection}
                        sx={{ mt: 2 }}
                    >
                        Add Section
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setIsCreatingNewTemplate(false); }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveNewTemplate} color="primary" variant="contained">
                        Save Template
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Audit Name Dialog */}
            <Dialog open={startNewAuditDialogOpen} onClose={handleCancelStartNewAuditDialog}>
                <DialogTitle>Name New Audit</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for the new audit instance.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="auditName"
                        label="Audit Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newAuditName}
                        onChange={(e) => setNewAuditName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelStartNewAuditDialog}>Cancel</Button>
                    <Button onClick={handleConfirmStartNewAudit} color="primary">
                        Create Audit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StartNewAuditSection;