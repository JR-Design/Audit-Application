import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Collapse
} from "@mui/material";

import UnarchiveIcon from '@mui/icons-material/Unarchive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

/**
 * Component for displaying completed audit history with filtering capabilities
 */
const HistorySection = ({ auditInstances, onViewAudit, onUnarchiveAudit }) => {
    const completedInstances = auditInstances.filter(instance => instance.status === 'completed');
    
    // State for filters
    const [nameFilter, setNameFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [templateFilter, setTemplateFilter] = useState('');
    const [filteredInstances, setFilteredInstances] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    
    // Get unique template names for the dropdown
    const templateNames = [...new Set(completedInstances.map(instance => instance.templateName))];
    
    // Format date for display
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        } catch (error) {
            console.log(error);
            return dateString;
        }
    };
    
    // Apply filters whenever relevant state changes
    useEffect(() => {
        let filtered = [...completedInstances];
        
        // Filter by name
        if (nameFilter) {
            filtered = filtered.filter(instance => 
                instance.name.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }
        
        // Filter by template
        if (templateFilter) {
            filtered = filtered.filter(instance => 
                instance.templateName === templateFilter
            );
        }
        
        // Filter by start date
        if (startDate) {
            const startDateTime = new Date(startDate);
            filtered = filtered.filter(instance => 
                new Date(instance.dateCompleted) >= startDateTime
            );
        }
        
        // Filter by end date
        if (endDate) {
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999);
            
            filtered = filtered.filter(instance => 
                new Date(instance.dateCompleted) <= endDateTime
            );
        }
        
        setFilteredInstances(filtered);
    }, [nameFilter, templateFilter, startDate, endDate, auditInstances]);
    
    // Clear all filters
    const clearFilters = () => {
        setNameFilter('');
        setStartDate('');
        setEndDate('');
        setTemplateFilter('');
    };

    // Toggle filter visibility
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <>
            <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">
                    Completed Audits
                </Typography>
                <Button 
                    variant="outlined" 
                    startIcon={showFilters ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    onClick={toggleFilters}
                    size="small"
                >
                    Filters
                </Button>
            </Box>
            
            {/* Filter controls */}
            <Collapse in={showFilters}>
                <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="Search by name"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Template</InputLabel>
                                <Select
                                    value={templateFilter}
                                    label="Template"
                                    onChange={(e) => setTemplateFilter(e.target.value)}
                                >
                                    <MenuItem value="">All templates</MenuItem>
                                    {templateNames.map((name) => (
                                        <MenuItem key={name} value={name}>{name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                label="From date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                label="To date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                startIcon={<FilterListIcon />}
                                onClick={clearFilters}
                            >
                                Clear
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Collapse>
            
            {/* Audit list */}
            <Grid container spacing={1}>
                {filteredInstances.map((instance) => (
                    <Grid item xs={12} key={instance.auditInstanceId}>
                        <Card sx={{ width: '100%' }}>
                            <CardContent>
                                <Grid container alignItems="center">
                                    {/* Left side - Audit details */}
                                    <Grid item xs={7}>
                                        <Typography variant="h6">
                                            {instance.name} 
                                            <Typography variant="caption" color="textSecondary" sx={{ml:1}}>
                                                ( {instance.templateName} )
                                            </Typography>
                                        </Typography>

                                        <Typography variant="body2">
                                            Completed on: {formatDate(instance.dateCompleted)}
                                        </Typography>
                                    </Grid>

                                    {/* Right side - Buttons */}
                                    <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            startIcon={<UnarchiveIcon />}
                                            onClick={() => onUnarchiveAudit(instance.auditInstanceId)}
                                        >
                                            Unarchive
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => onViewAudit(instance.auditInstanceId)}
                                        >
                                            View
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {filteredInstances.length === 0 && (
                    <Grid item xs={12}>
                        <Typography variant="body1" color="textSecondary">
                            {completedInstances.length === 0 
                                ? 'No completed audits yet.' 
                                : 'No audits match the current filters.'}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default HistorySection;