import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

/**
 * Confirmation dialog for completing audits
 */
const ConfirmCompleteDialog = ({ open, onClose, onConfirm, auditId }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => onConfirm(auditId)} color="primary" autoFocus>
                    Confirm Complete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmCompleteDialog;