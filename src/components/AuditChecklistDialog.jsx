import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, 
         Button, TextField, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChecklistCard from './ChecklistCard';
import { calculateProgress } from '../utils/auditUtils';

/**
 * Dialog component for viewing and editing audit checklists
 */
const AuditChecklistDialog = ({ open, onClose, selectedAudit, onSaveChecklist, readOnlyDialog }) => {
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

export default AuditChecklistDialog;