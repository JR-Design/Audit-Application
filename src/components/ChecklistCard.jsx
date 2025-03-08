import React from 'react';
import { Card, CardContent, Button, TextField, FormControlLabel, Checkbox } from "@mui/material";

/**
 * Reusable Checklist Card Component
 * @param {Object} props - Component props
 * @param {Object} props.item - The checklist item object
 * @param {Function} props.onCheckChange - Handler for check changes
 * @param {Function} props.onCommentChange - Handler for comment changes
 * @param {Function} props.onAddComment - Handler for adding/removing comment
 * @param {boolean} props.readOnly - Whether the card is in read-only mode
 */
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

export default ChecklistCard;