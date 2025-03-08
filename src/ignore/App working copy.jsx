import React, { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, Button, Container, Typography, Grid, LinearProgress, Box, Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, FormControlLabel, Checkbox, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


// --- Helper Function: calculateProgress ---
const calculateProgress = (checklist) => {
    if (!checklist || checklist.length === 0) return 0;
    const completedItems = checklist.filter(item => item.checked).length;
    return Math.round((completedItems / checklist.length) * 100);
};


// --- Reusable Checklist Card Component ---
const ChecklistCard = ({ item, onCheckChange, onCommentChange, onAddComment, readOnly }) => {
    return (
        <Card sx={{ mb: 1 }}>
            <CardContent>
                <FormControlLabel
                    disabled={readOnly}
                    control={<Checkbox checked={item.checked} onChange={e => onCheckChange(item.id, e.target.checked)} />}
                    label={item.text}
                />
                {item.addComment && (
                    <TextField
                        label="Comment"
                        multiline
                        rows={2}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={item.comment}
                        InputProps={{
                            readOnly: readOnly,
                        }}
                        onChange={e => onCommentChange(item.id, e.target.value)}
                    />
                )}
                {!readOnly && (
                    <Button size="small" onClick={() => onAddComment(item.id)}>
                        {item.addComment ? 'Hide Comment' : 'Add Comment'}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};


const AuditChecklistDialog = ({ open, onClose, selectedAudit, onChecklistItemChange, onSaveChecklist, readOnlyDialog }) => {
    const [localAudit, setLocalAudit] = useState(selectedAudit);
    const [auditName, setAuditName] = useState(selectedAudit ? selectedAudit.name : "");
    const categories = [...new Set(localAudit?.checklist.map(item => item.category) || [])];


    useEffect(() => {
        setLocalAudit(selectedAudit);
        setAuditName(selectedAudit ? selectedAudit.name : "");
    }, [selectedAudit]);


    const handleCheckChange = (itemId, checked) => {
        if (readOnlyDialog) return;

        const updatedChecklist = localAudit.checklist.map(item =>
            item.id === itemId ? { ...item, checked: checked, completionTimestamp: checked ? new Date().toISOString() : null } : item
        );
        const progress = calculateProgress(updatedChecklist);
        setLocalAudit({ ...localAudit, checklist: updatedChecklist, progress: progress });
    };

    const handleCommentChange = (itemId, comment) => {
        if (readOnlyDialog) return;
        const updatedChecklist = localAudit.checklist.map(item =>
            item.id === itemId ? { ...item, comment: comment } : item
        );
        setLocalAudit({ ...localAudit, checklist: updatedChecklist });
    };

    const handleAddComment = (itemId) => {
        if (readOnlyDialog) return;
        const updatedChecklist = localAudit.checklist.map(item =>
            item.id === itemId ? { ...item, addComment: !item.addComment } : item
        );
        setLocalAudit({ ...localAudit, checklist: updatedChecklist });
    };

    const handleAuditNameChange = (event) => {
        setAuditName(event.target.value);
    };


    const handleSave = () => {
        if (readOnlyDialog) {
            onClose();
            return;
        }
        const progress = calculateProgress(localAudit.checklist);
        const updatedAuditWithProgress = { ...localAudit, name: auditName, progress: progress };
        onSaveChecklist(updatedAuditWithProgress);
        onClose();
    };

    if (!localAudit) {
        return null;
    }


    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
            <DialogTitle>
                {!readOnlyDialog ? (
                    <TextField
                        label="Audit Name"
                        variant="standard"
                        value={auditName}
                        onChange={handleAuditNameChange}
                        fullWidth
                    />
                ) : (
                    `${localAudit.name} - Audit Details`
                )}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {readOnlyDialog ? "Audit details and checklist review." : "Review and complete the checklist items for this audit."}
                </DialogContentText>
                {categories.map(category => (
                    <Accordion key={category} defaultExpanded={true} sx={{ mb: 2 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel-${category}-content`}
                            id={`panel-${category}-header`}
                        >
                            <Typography variant="h6">{category}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {localAudit.checklist
                                .filter(item => item.category === category)
                                .map(item => (
                                    <ChecklistCard
                                        key={item.id}
                                        item={item}
                                        onCheckChange={handleCheckChange}
                                        onCommentChange={handleCommentChange}
                                        onAddComment={handleAddComment}
                                        readOnly={readOnlyDialog}
                                    />
                                ))}
                        </AccordionDetails>
                    </Accordion>
                ))}
                {categories.length === 0 && localAudit.checklist.map(item => (
                    <ChecklistCard
                        key={item.id}
                        item={item}
                        onCheckChange={handleCheckChange}
                        onCommentChange={handleCommentChange}
                        onAddComment={handleAddComment}
                        readOnly={readOnlyDialog}
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
                {!readOnlyDialog && (
                    <Button onClick={handleSave} color="primary">
                        Save & Close
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};


const initialAuditTemplates = [
    {
        id: 1,
        name: "ISO 9001 Audit",
        checklist: [
            { id: 1, text: "Document Control Procedures", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 1: Document Control" },
            { id: 2, text: "Corrective and Preventive Actions", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 2: Corrective Actions" },
            { id: 3, text: "Internal Audit Results", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 3: Internal Audits" },
            { id: 10, text: "Management Review", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 4: Management Review" },
            { id: 11, text: "Resource Management", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 4: Management Review" },
        ]
    },
    {
        id: 2,
        name: "Safety Compliance Audit",
        checklist: [
            { id: 4, text: "Emergency Exit Routes Marked", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 1: Emergency Preparedness" },
            { id: 5, text: "Fire Extinguishers Inspected", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 2: Fire Safety" },
            { id: 6, text: "Employee Safety Training Completed", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 3: Training & Competency" },
            { id: 12, text: "First Aid Supplies", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 2: Fire Safety" },
        ]
    },
    {
        id: 3,
        name: "Environmental Audit",
        checklist: [
            { id: 7, text: "Waste Management Procedures", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 1: Waste Management" },
            { id: 8, text: "Energy Consumption Monitoring", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 2: Resource Management" },
            { id: 9, text: "Water Usage Efficiency", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 2: Resource Management" },
            { id: 13, text: "Pollution Control Measures", checked: false, comment: "", addComment: false, completionTimestamp: null, category: "Section 3: Pollution Prevention" },
        ]
    },
];


export default function AuditChecklist() {
    const [auditInstances, setAuditInstances] = useState(() => {
        const storedInstances = localStorage.getItem('auditInstances');
        if (storedInstances) {
            try {
                const parsedInstances = JSON.parse(storedInstances);
                return parsedInstances;
            } catch (error) {
                console.error("Error parsing auditInstances from localStorage:", error);
                return [];
            }
        } else {
            return [];
        }
    });
    const [homepageUpdateTrigger, setHomepageUpdateTrigger] = useState(0);
    const [selectedAuditInstanceId, setSelectedAuditInstanceId] = useState(null);
    const [auditData, setAuditData] = useState([]);
    const [open, setOpen] = useState(false);
    const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false);
    const [viewAuditOpen, setViewAuditOpen] = useState(false);
    const [newAuditName, setNewAuditName] = useState('');
    const [startNewAuditDialogOpen, setStartNewAuditDialogOpen] = useState(false);
    const [selectedAuditTemplateForNewAudit, setSelectedAuditTemplateForNewAudit] = useState(null);


    useEffect(() => {
        const storedInstances = localStorage.getItem('auditInstances');
        if (storedInstances) {
            try {
                JSON.parse(storedInstances);
            } catch (error) {
                console.error("Error parsing auditInstances from localStorage (useEffect):", error);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('auditInstances', JSON.stringify(auditInstances));
    }, [auditInstances]);


    const handleStartNewAudit = (template) => {
        setSelectedAuditTemplateForNewAudit(template);
        setNewAuditName('');
        setStartNewAuditDialogOpen(true);
    };


    const handleConfirmStartNewAudit = () => {
        if (!selectedAuditTemplateForNewAudit) return;

        const newAuditInstance = {
            auditInstanceId: uuidv4(),
            name: newAuditName.trim() !== '' ? newAuditName : selectedAuditTemplateForNewAudit.name + " - Initial",
            templateName: selectedAuditTemplateForNewAudit.name,
            status: 'in-progress',
            templateId: selectedAuditTemplateForNewAudit.id,
            checklist: selectedAuditTemplateForNewAudit.checklist,
            checklistResponses: selectedAuditTemplateForNewAudit.checklist.map(item => ({
                checklistResponseId: uuidv4(),
                checklistId: item.id,
                status: 'pending',
                comment: null,
                completionTimestamp: null,
            })),
            progress: 0,
            dateCreated: new Date().toISOString(),
            dateCompleted: null,
        };
        setAuditInstances([newAuditInstance, ...auditInstances]);
        setHomepageUpdateTrigger(Math.random());
        setStartNewAuditDialogOpen(false);
        setSelectedAuditTemplateForNewAudit(null);
        setNewAuditName('');
    };


    const handleCancelStartNewAuditDialog = () => {
        setStartNewAuditDialogOpen(false);
        setSelectedAuditTemplateForNewAudit(null);
        setNewAuditName('');
    };


    const handleDeleteAudit = (auditInstanceId) => {
        const updatedInstances = auditInstances.filter(instance => instance.auditInstanceId !== auditInstanceId);
        setAuditInstances(updatedInstances);
        setHomepageUpdateTrigger(Math.random());
    };


    const handleContinueAudit = (auditInstanceId) => {
        setSelectedAuditInstanceId(auditInstanceId);
        setOpen(true);
        setViewAuditOpen(false);
    };

    const handleDialogClose = () => {
        setOpen(false);
        setViewAuditOpen(false);
    };

    const handleSaveChecklist = (updatedAudit) => {
        const progress = calculateProgress(updatedAudit.checklist);
        const updatedAuditWithProgress = { ...updatedAudit, progress: progress };

        const updatedAuditInstances = auditInstances.map(instance =>
            instance.auditInstanceId === updatedAudit.auditInstanceId ? updatedAuditWithProgress : instance
        );
        setAuditInstances(updatedAuditInstances);
        setHomepageUpdateTrigger(Math.random());
        setOpen(false);
    };


    const handleConfirmCompleteAudit = (auditInstanceId) => {
        setSelectedAuditInstanceId(auditInstanceId);
        setConfirmCompleteOpen(true);
    };

    const handleCancelCompleteAudit = () => {
        setConfirmCompleteOpen(false);
        setSelectedAuditInstanceId(null);
    };


    const handleCompleteAudit = (auditInstanceId) => {
        const updatedAuditInstances = auditInstances.map(instance => {
            if (instance.auditInstanceId === auditInstanceId) {
                return {
                    ...instance,
                    status: 'completed',
                    dateCompleted: new Date().toISOString(),
                };
            }
            return instance;
        });
        setAuditInstances(updatedAuditInstances);
        setHomepageUpdateTrigger(Math.random());
        setConfirmCompleteOpen(false);
        setSelectedAuditInstanceId(null);
    };


    const handleViewAudit = (auditInstanceId) => {
        setSelectedAuditInstanceId(auditInstanceId);
        setViewAuditOpen(true);
        setOpen(false);
    };


    const handleUnarchiveAudit = (auditInstanceId) => {
        const updatedAuditInstances = auditInstances.map(instance => {
            if (instance.auditInstanceId === auditInstanceId) {
                return {
                    ...instance,
                    status: 'in-progress',
                    dateCompleted: null,
                };
            }
            return instance;
        });
        setAuditInstances(updatedAuditInstances);
        setHomepageUpdateTrigger(Math.random());
    };


    const currentAuditsSection = (props) => {
        const { currentAuditInstances } = props;
        const inProgressInstances = currentAuditInstances.filter(instance => instance.status === 'in-progress');

        return (
            <>
                <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                    Current Audits
                </Typography>
                <Grid container spacing={2}>
                    {inProgressInstances.map((instance) => (
                        <Grid item xs={12} sm={6} md={4} key={instance.auditInstanceId}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Typography variant="h6">{instance.name}
                                        <Typography variant="caption" color="textSecondary">
                                            (Template: {instance.templateName})
                                        </Typography>
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="body2" sx={{ mr: 1, minWidth: '40px' }}>Progress: {instance.progress}%</Typography>
                                        <LinearProgress variant="determinate" value={instance.progress} sx={{ flexGrow: 1 }} />
                                    </Box>
                                    <Button variant="contained" color="primary" sx={{ mb: 1 }} onClick={() => handleContinueAudit(instance.auditInstanceId)}>
                                        Continue Audit
                                    </Button>
                                    <Button variant="contained" color="success" sx={{ mb: 1 }} onClick={() => handleConfirmCompleteAudit(instance.auditInstanceId)}>
                                        Complete Audit
                                    </Button>
                                    <Button variant="contained" color="error" sx={{ mt: 'auto' }} onClick={() => handleDeleteAudit(instance.auditInstanceId)}>
                                        Delete Audit
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {inProgressInstances.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="textSecondary">No audits currently in progress.</Typography>
                        </Grid>
                    )}
                </Grid>
            </>
        );
    };


    const historySection = (props) => {
        const { historyAuditInstances, trigger } = props;
        const completedInstances = historyAuditInstances.filter(instance => instance.status === 'completed');
        return (
            <>
                <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                    History of Completed Audits
                </Typography>
                <Grid container spacing={2}>
                    {completedInstances.map((instance) => (
                        <Grid item xs={12} sm={6} md={4} key={instance.auditInstanceId}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Typography variant="h6">{instance.name}
                                        <Typography variant="caption" color="textSecondary">
                                            (Template: {instance.templateName})
                                        </Typography>
                                    </Typography>
                                    <Typography variant="body2">Completed on: {instance.dateCompleted}</Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        sx={{ mt: 'auto', mb: 1, marginTop: 0 }}
                                        onClick={() => handleViewAudit(instance.auditInstanceId)}
                                    >
                                        View Audit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ mt: 'auto', marginTop: 0 }}
                                        onClick={() => handleUnarchiveAudit(instance.auditInstanceId)}
                                    >
                                        Unarchive Audit
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    {completedInstances.length === 0 && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="textSecondary">No completed audits yet.</Typography>
                        </Grid>
                    )}
                </Grid>
            </>
        );
    };


    const startNewAuditSection = (props) => {
        return (
            <>
                <Typography variant="h4" gutterBottom>
                    Start New Audit
                </Typography>
                <Grid container spacing={2}>
                    {initialAuditTemplates.map((template) => (
                        <Grid item xs={12} sm={6} md={4} key={template.id}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Typography variant="h6">{template.name}</Typography>
                                    <Button variant="contained" color="primary" sx={{ mt: 'auto' }} onClick={() => handleStartNewAudit(template)}>
                                        Create New
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {/* --- Start New Audit Dialog --- */}
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
                        <Button onClick={handleConfirmStartNewAudit}>Create Audit</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    };



    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            {startNewAuditSection()}
            <Divider sx={{ my: 4 }} />
            {currentAuditsSection({ currentAuditInstances: [...auditInstances], trigger: homepageUpdateTrigger })}
            <Divider sx={{ my: 4 }} />
            {historySection({ historyAuditInstances: [...auditInstances], trigger: homepageUpdateTrigger })}

            <AuditChecklistDialog
                open={open}
                onClose={handleDialogClose}
                selectedAudit={auditInstances.find(instance => instance.auditInstanceId === selectedAuditInstanceId)}
                onSaveChecklist={handleSaveChecklist}
                readOnlyDialog={false}
            />

            <AuditChecklistDialog
                open={viewAuditOpen}
                onClose={handleDialogClose}
                selectedAudit={auditInstances.find(instance => instance.auditInstanceId === selectedAuditInstanceId)}
                onSaveChecklist={() => { }}
                readOnlyDialog={true}
            />


            <Dialog
                open={confirmCompleteOpen}
                onClose={handleCancelCompleteAudit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Complete Audit?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to complete this audit? Once completed, it will be moved to the audit history and cannot be edited further.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelCompleteAudit} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleCompleteAudit(selectedAuditInstanceId)} color="primary" autoFocus>
                        Confirm Complete
                    </Button>
                </DialogActions>
            </Dialog>


        </Container>
    );
}