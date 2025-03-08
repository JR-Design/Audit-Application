import React, { useState, useEffect } from "react";
import { Container, Divider } from "@mui/material";

// Import components
import StartNewAuditSection from "./StartNewAuditSection";
import CurrentAuditsSection from "./CurrentAuditsSection";
import HistorySection from "./HistorySection";
import AuditChecklistDialog from "./AuditChecklistDialog";
import ConfirmCompleteDialog from "./ConfirmCompleteDialog";

function Home() {
    // State management
    const [auditInstances, setAuditInstances] = useState(() => {
        const storedInstances = localStorage.getItem('auditInstances');
        if (storedInstances) {
            try {
                const parsed = JSON.parse(storedInstances);
                // Ensure all in-progress audits have a tag
                return parsed.map(instance => {
                    if (instance.status === 'in-progress' && !instance.tag) {
                        return { ...instance, tag: 'todo' };
                    }
                    return instance;
                });
            } catch (error) {
                console.error("Error parsing auditInstances from localStorage:", error);
                return [];
            }
        } else {
            return [];
        }
    });
    
    const [selectedAuditInstanceId, setSelectedAuditInstanceId] = useState(null);
    const [checklistDialogOpen, setChecklistDialogOpen] = useState(false);
    const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false);
    const [viewAuditOpen, setViewAuditOpen] = useState(false);

    // Save to localStorage whenever audit instances change
    useEffect(() => {
        localStorage.setItem('auditInstances', JSON.stringify(auditInstances));
    }, [auditInstances]);

    // Handler functions
    const handleAuditCreated = (newAudit) => {
        // New audits default to 'todo' tag
        const auditWithTag = { ...newAudit, tag: 'todo' };
        setAuditInstances([auditWithTag, ...auditInstances]);
    };

    const handleDeleteAudit = (auditInstanceId) => {
        const updatedInstances = auditInstances.filter(instance => instance.auditInstanceId !== auditInstanceId);
        setAuditInstances(updatedInstances);
    };

    const handleContinueAudit = (auditInstanceId) => {
        setSelectedAuditInstanceId(auditInstanceId);
        setChecklistDialogOpen(true);
        setViewAuditOpen(false);
    };

    const handleChecklistDialogClose = () => {
        setChecklistDialogOpen(false);
        setViewAuditOpen(false);
    };

    const handleSaveChecklist = (updatedAudit) => {
        const updatedAuditInstances = auditInstances.map(instance =>
            instance.auditInstanceId === updatedAudit.auditInstanceId ? updatedAudit : instance
        );
        setAuditInstances(updatedAuditInstances);
        setChecklistDialogOpen(false);
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
                    // Remove tag when completing audit
                    tag: undefined
                };
            }
            return instance;
        });
        setAuditInstances(updatedAuditInstances);
        setConfirmCompleteOpen(false);
        setSelectedAuditInstanceId(null);
    };
    
    const handleViewAudit = (auditInstanceId) => {
        setSelectedAuditInstanceId(auditInstanceId);
        setViewAuditOpen(true);
        setChecklistDialogOpen(true);
    };
    
    const handleUnarchiveAudit = (auditInstanceId) => {
        const updatedAuditInstances = auditInstances.map(instance => {
            if (instance.auditInstanceId === auditInstanceId) {
                return {
                    ...instance,
                    status: 'in-progress',
                    dateCompleted: null,
                    // Set unarchived audits to 'in-progress' tag by default
                    tag: 'in-progress'
                };
            }
            return instance;
        });
        setAuditInstances(updatedAuditInstances);
    };
    
    // New handler for tag changes
    const handleTagChange = (auditInstanceId, newTag) => {
        const updatedAuditInstances = auditInstances.map(instance => {
            if (instance.auditInstanceId === auditInstanceId) {
                return {
                    ...instance,
                    tag: newTag
                };
            }
            return instance;
        });
        setAuditInstances(updatedAuditInstances);
    };
    
    // Find the selected audit instance
    const selectedAudit = auditInstances.find(
        instance => instance.auditInstanceId === selectedAuditInstanceId
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <StartNewAuditSection onAuditCreated={handleAuditCreated} />
            <Divider sx={{ my: 3 }} />
            
            <CurrentAuditsSection 
                auditInstances={auditInstances} 
                onContinueAudit={handleContinueAudit} 
                onCompleteAudit={handleConfirmCompleteAudit} 
                onDeleteAudit={handleDeleteAudit}
                onTagChange={handleTagChange}
            />
            <Divider sx={{ my: 3 }} />
            
            <HistorySection 
                auditInstances={auditInstances} 
                onViewAudit={handleViewAudit} 
                onUnarchiveAudit={handleUnarchiveAudit} 
            />
            
            {/* Audit Checklist Dialog */}
            <AuditChecklistDialog 
                open={checklistDialogOpen} 
                onClose={handleChecklistDialogClose} 
                selectedAudit={selectedAudit} 
                onSaveChecklist={handleSaveChecklist} 
                readOnlyDialog={viewAuditOpen} 
            />
            
            {/* Confirm Complete Dialog */}
            <ConfirmCompleteDialog 
                open={confirmCompleteOpen} 
                onClose={handleCancelCompleteAudit} 
                onConfirm={handleCompleteAudit} 
                auditId={selectedAuditInstanceId} 
            />
        </Container>
    );
}

export default Home;