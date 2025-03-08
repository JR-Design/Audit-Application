import React, { useState, useEffect } from "react";
import { Container, Divider } from "@mui/material";

// Import components
import StartNewAuditSection from "./components/StartNewAuditSection";
import CurrentAuditsSection from "./components/CurrentAuditsSection";
import HistorySection from "./components/HistorySection";
import AuditChecklistDialog from "./components/AuditChecklistDialog";
import ConfirmCompleteDialog from "./components/ConfirmCompleteDialog";

function AuditChecklist() {
    // State management
    const [auditInstances, setAuditInstances] = useState(() => {
        const storedInstances = localStorage.getItem('auditInstances');
        if (storedInstances) {
            try {
                return JSON.parse(storedInstances);
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
    const [updateTrigger, setUpdateTrigger] = useState(0);

    // Save to localStorage whenever audit instances change
    useEffect(() => {
        localStorage.setItem('auditInstances', JSON.stringify(auditInstances));
    }, [auditInstances]);

    // Handler functions
    const handleAuditCreated = (newAudit) => {
        setAuditInstances([newAudit, ...auditInstances]);
        setUpdateTrigger(Math.random());
    };

    const handleDeleteAudit = (auditInstanceId) => {
        const updatedInstances = auditInstances.filter(instance => instance.auditInstanceId !== auditInstanceId);
        setAuditInstances(updatedInstances);
        setUpdateTrigger(Math.random());
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
        setUpdateTrigger(Math.random());
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
                };
            }
            return instance;
        });
        setAuditInstances(updatedAuditInstances);
        setUpdateTrigger(Math.random());
        setConfirm