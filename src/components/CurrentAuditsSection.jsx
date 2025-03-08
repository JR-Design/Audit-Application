import React, { useState } from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Box, 
  LinearProgress, 
  IconButton, 
  Stack,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Chip,
  Menu,
  Popover
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/**
 * Component for displaying and managing current in-progress audits
 */
const CurrentAuditsSection = ({ auditInstances, onContinueAudit, onCompleteAudit, onDeleteAudit, onTagChange }) => {
    const inProgressInstances = auditInstances.filter(instance => instance.status === 'in-progress');
    
    // State for column visibility
    const [showTodo, setShowTodo] = useState(true);
    const [showInProgress, setShowInProgress] = useState(true);
    const [showBlocked, setShowBlocked] = useState(true);

    // State for undo snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [undoAction, setUndoAction] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Filter audits by tag
    const todoAudits = inProgressInstances.filter(instance => instance.tag === 'todo');
    const inProgressAudits = inProgressInstances.filter(instance => instance.tag === 'in-progress');
    const blockedAudits = inProgressInstances.filter(instance => instance.tag === 'blocked');

    // Handle tag change
    const handleTagChange = (auditId, newTag) => {
        const audit = inProgressInstances.find(instance => instance.auditInstanceId === auditId);
        const oldTag = audit.tag;
        
        // Save undo information
        setUndoAction(() => () => onTagChange(auditId, oldTag));
        setSnackbarMessage(`Moved audit "${audit.name}" to ${newTag.replace('-', ' ')}`);
        setSnackbarOpen(true);
        
        // Call parent handler
        onTagChange(auditId, newTag);
    };

    // Close snackbar
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    // Handle undo action
    const handleUndo = () => {
        if (undoAction) {
            undoAction();
            setSnackbarOpen(false);
        }
    };

    // Render audit card
    const renderAuditCard = (instance) => (
        <Grid item xs={12} key={instance.auditInstanceId}>
            <Card sx={{ height: '100%' }}>
                <LinearProgress variant="determinate" value={instance.progress} sx={{ flexGrow: 1 }} />
                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6">
                                {instance.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                <VerifiedUserIcon color="primary" sx={{ p: 0, mr: 1, fontSize: '16px', mb: '-3px' }} /> 
                                ( {instance.templateName} )
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                                size="small" 
                                color="error" 
                                onClick={() => onDeleteAudit(instance.auditInstanceId)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                            
                            <IconButton 
                                size="small" 
                                color="success" 
                                onClick={() => onCompleteAudit(instance.auditInstanceId)}
                            >
                                <CheckIcon fontSize="small" />
                            </IconButton>
                            
                            <Box
                                sx={{ 
                                    cursor: 'pointer',
                                    '&:hover': {
                                        opacity: 0.8
                                    }
                                }}
                                onClick={(event) => {
                                    // Open Menu
                                    const statusMenu = document.getElementById(`status-menu-${instance.auditInstanceId}`);
                                    if (statusMenu) {
                                        statusMenu.style.display = 'block';
                                        const rect = event.currentTarget.getBoundingClientRect();
                                        statusMenu.style.position = 'absolute';
                                        statusMenu.style.left = `${rect.left}px`;
                                        statusMenu.style.top = `${rect.bottom + 5}px`;
                                        statusMenu.style.zIndex = '1300';
                                        
                                        // Add close handler
                                        const closeMenu = (e) => {
                                            if (!statusMenu.contains(e.target) && event.currentTarget !== e.target) {
                                                statusMenu.style.display = 'none';
                                                document.removeEventListener('click', closeMenu);
                                            }
                                        };
                                        
                                        setTimeout(() => {
                                            document.addEventListener('click', closeMenu);
                                        }, 0);
                                    }
                                }}
                            >
                                {/* Hidden Menu */}
                                <div 
                                    id={`status-menu-${instance.auditInstanceId}`} 
                                    style={{display: 'none'}}
                                >
                                    <Box sx={{ bgcolor: 'background.paper', boxShadow: 3, borderRadius: 1, overflow: 'hidden' }}>
                                        <MenuItem 
                                            onClick={() => handleTagChange(instance.auditInstanceId, 'todo')}
                                            selected={instance.tag === 'todo'}
                                        >
                                            To do
                                        </MenuItem>
                                        <MenuItem 
                                            onClick={() => handleTagChange(instance.auditInstanceId, 'in-progress')}
                                            selected={instance.tag === 'in-progress'}
                                        >
                                            In progress
                                        </MenuItem>
                                        <MenuItem 
                                            onClick={() => handleTagChange(instance.auditInstanceId, 'blocked')}
                                            selected={instance.tag === 'blocked'}
                                        >
                                            Blocked
                                        </MenuItem>
                                    </Box>
                                </div>
                                {(() => {
                                    // Determine chip color based on tag
                                    let color = 'default';
                                    let label = 'To do';
                                    
                                    if (instance.tag === 'in-progress') {
                                        color = 'primary';
                                        label = 'In progress';
                                    } else if (instance.tag === 'blocked') {
                                        color = 'error';
                                        label = 'Blocked';
                                    }
                                    
                                    return (
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                height: '24px',
                                                color: color === 'default' ? 'rgba(0, 0, 0, 0.6)' : 'white',
                                                backgroundColor: color === 'default' ? 'rgba(0, 0, 0, 0.08)' : 
                                                                color === 'primary' ? 'primary.main' : 
                                                                'error.main',
                                                borderRadius: '16px',
                                                whiteSpace: 'nowrap',
                                                px: 1,
                                                mt: '3px',
                                                fontSize: '0.8125rem',
                                                fontFamily: 'sans-serif',
                                                fontWeight: 500
                                            }}
                                        >
                                            <Typography variant='subtitle2'>
                                                {label}
                                            </Typography>
                                        </Box>
                                    );
                                })()}
                            </Box>
                        </Box>
                    </Box>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ mb: 1 }} 
                        onClick={() => onContinueAudit(instance.auditInstanceId)}
                    >
                        Continue Audit
                    </Button>


                </CardContent>
            </Card>
        </Grid>
    );

    // Column header with collapse toggle
    const renderColumnHeader = (title, count, isVisible, toggleVisibility, color) => (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 1, 
            bgcolor: 'white', 
            color: 'text.primary',
            borderRadius: 1,
            mb: 1,
            borderBottom: `3px solid ${color}`
        }}>
            <Typography variant="subtitle1">
                {title} ({count})
            </Typography>
            <IconButton 
                size="small" 
                onClick={toggleVisibility} 
                sx={{ color: 'text.secondary' }}
            >
                {isVisible ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
        </Box>
    );

    return (
        <>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
                Current Audits
            </Typography>
            
            {inProgressInstances.length === 0 ? (
                <Typography variant="body1" color="textSecondary">No audits currently in progress.</Typography>
            ) : (
                <Grid container spacing={2}>
                    {/* To Do Column */}
                    <Grid item xs={12} md={4}>
                        {renderColumnHeader('To Do', todoAudits.length, showTodo, () => setShowTodo(!showTodo), 'grey.500')}
                        <Collapse in={showTodo}>
                            <Box sx={{ backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                                <Grid container spacing={2}>
                                    {todoAudits.map(renderAuditCard)}
                                    {todoAudits.length === 0 && (
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="textSecondary" sx={{ p: 1 }}>
                                                No audits in this status
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </Collapse>
                    </Grid>

                    {/* In Progress Column */}
                    <Grid item xs={12} md={4}>
                        {renderColumnHeader('In Progress', inProgressAudits.length, showInProgress, () => setShowInProgress(!showInProgress), 'primary.main')}
                        <Collapse in={showInProgress}>
                            <Box sx={{ backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                                <Grid container spacing={2}>
                                    {inProgressAudits.map(renderAuditCard)}
                                    {inProgressAudits.length === 0 && (
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="textSecondary" sx={{ p: 1 }}>
                                                No audits in this status
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </Collapse>
                    </Grid>

                    {/* Blocked Column */}
                    <Grid item xs={12} md={4}>
                        {renderColumnHeader('Blocked', blockedAudits.length, showBlocked, () => setShowBlocked(!showBlocked), 'error.main')}
                        <Collapse in={showBlocked}>
                            <Box sx={{ backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                                <Grid container spacing={2}>
                                    {blockedAudits.map(renderAuditCard)}
                                    {blockedAudits.length === 0 && (
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="textSecondary" sx={{ p: 1 }}>
                                                No audits in this status
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </Collapse>
                    </Grid>
                </Grid>
            )}

            {/* Notification Snackbar with Undo */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={10000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity="info" 
                    sx={{ width: '100%' }}
                    action={
                        <Button color="inherit" size="small" onClick={handleUndo}>
                            UNDO
                        </Button>
                    }
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CurrentAuditsSection;