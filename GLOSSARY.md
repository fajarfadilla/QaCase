# WeMine

WeMine is a b2b saas product that has purpose to help people that work in mining sites record their activities, equipment condition, and report some missconducts.

## Language

### Platform

**WeMine**:
The mobile app used by Employees in the field.
_Avoid_: Mobile, the app (when the web app could also be meant)

**WeMineOffice**:
The web app used for administration, including the Form Builder.
_Avoid_: Web, dashboard, back office

**Tenant**:
A mining company subscribed to WeMine. Every Employee, item of Master Data and record belongs to exactly one Tenant.
_Avoid_: Company, client, organization

**Master Data**:
A Tenant's reference data (Locations, Sublocations, Areas, Employees, Forms) that is downloaded to the device so the apps can work offline.
_Avoid_: Lookup data, config, dropdown data

**Sync**:
Sending records created while offline to the backend once a connection is available again.
_Avoid_: Upload, push, send

### People

**Employee**:
A person in a Tenant's Master Data who can sign in and can be selected in forms.
_Avoid_: User, worker, staff

**Reporter**:
The Employee who submits a Hazard Report.
_Avoid_: Submitter, creator, finder

**PIC**:
The Person In Charge of fixing a Hazard: the Employee assigned to its Followup Task. Defaults to the Reporter.
_Avoid_: Assignee, owner, responsible person

**Co Observer**:
An Employee recorded on a Followup Task as a witness to the resolution, in addition to the PIC.
_Avoid_: Witness, co-reporter, participant

**Area Member**:
An Employee assigned to an Area.
_Avoid_: People in the area, area user

**Direct Supervisor**:
The single Employee responsible for an Area.
_Avoid_: Supervisor (on its own), manager, area lead

### Places

**Location**:
The top level of a Tenant's site hierarchy, such as a mine site. Contains one or more Sublocations.
_Avoid_: Site, place

**Sublocation**:
A division of a Location, such as a pit or a workshop. Belongs to exactly one Location and contains one or more Areas.
_Avoid_: Sub-site, zone

**Area**:
The smallest place in the site hierarchy. Belongs to exactly one Sublocation and has Area Members and one Direct Supervisor.
_Avoid_: Spot, section, zone

### Hazard

**Hazard Report**:
The form a Reporter fills in and submits to report a safety finding.
_Avoid_: Hazard form, finding (as a noun for the form)

**Hazard**:
The record one submitted Hazard Report creates. It is open until its Followup Task is submitted, then it is resolved.
_Avoid_: Hazard entry, incident, finding

**Followup Task**:
The remediation work created together with a Hazard and assigned to its PIC. Each Hazard has exactly one.
_Avoid_: Follow-up, action item, ticket

**Evidence**:
Photos attached to a Hazard Report or a Followup Task as proof of the condition.
_Avoid_: Attachment, picture, image

**Resolution Date**:
The date and time the PIC fixed the issue behind a Hazard.
_Avoid_: Fixed date, closed date, completion date

### Equipment Inspection

**Form Builder**:
The WeMineOffice tool for defining Forms.
_Avoid_: Form designer, form editor

**Form**:
A definition of between 1 and 50 Fields, identified by a Form Code, that Employees fill in during an Equipment Inspection.
_Avoid_: Template, checklist, questionnaire

**Form Code**:
The unique identifier of a Form within a Tenant; picking it loads that Form's Fields.
_Avoid_: Form ID, form type

**Field**:
One input in a Form: Text, Date Picker, Select, Radio (up to four options) or Image Picker.
_Avoid_: Question, input, control

**Equipment Inspection**:
The WeMine feature in which Employees inspect equipment by filling in a Form.
_Avoid_: Inspection form, equipment check

**Inspection Submission**:
One completed Form submitted during an Equipment Inspection.
_Avoid_: Entry, response, record
