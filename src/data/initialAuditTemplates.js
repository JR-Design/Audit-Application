const initialAuditTemplates = [
    {
        id: 1,
        name: "ISO 9001",
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
        name: "Safety Compliance",
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

export default initialAuditTemplates;