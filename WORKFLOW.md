# Turees Workflow

## Purpose

This document defines the agreed business workflow for the Turees project.
Code, schema, UI, and navigation should follow this workflow unless the team
explicitly updates this file.

## Product Direction

Turees is an operational rental tracking system for construction materials.

The public entry point is a landing page. New users start from the landing
page, sign up, register their personal and company information, and then enter
the dashboard.

The core of the system is:

- material movement
- remaining balance tracking
- money settlement

The system is not centered on master contracts. For the current MVP, the
`MasterContract` flow is removed.

## Core Entities

The MVP should be built around these entities:

- `Company`
- `User`
- `Material`
- `Rental`
- `RentalMovement`
- `Settlement`

`HandoverAct` is not part of the first MVP unless the team later decides that a
separate signed document is mandatory.

## Main Workflow

The agreed workflow is:

1. User visits the landing page
2. User signs up
3. User saves personal information and company information during onboarding
4. System creates the initial company and user profile
5. User enters the dashboard
6. User registers rentable materials with default price
7. User creates a rental record between two companies
8. User records material movements as given out or returned
9. System shows live remaining balance per material inside the rental
10. User generates money settlement from the rental movements
11. User closes the rental when all material is returned and settlement is finished

## Entry Flow

The first user journey starts outside the app and continues into the dashboard.

### Landing Page

Purpose:

- explain the product clearly
- give the user a signup entry point
- convert visitors into registered users

### Signup And Onboarding

During signup, the system must save:

- user first name
- user last name
- user email
- user phone
- user position if needed
- company name
- company register number if needed
- company phone
- company email
- company address if needed
- company role

Expected result:

- one user account is created
- one company record is created
- the user is linked to that company
- the user is redirected to the dashboard

## Business Meaning Of Each Entity

### Company

Represents either the owner side or renter side.

### User

Represents the employees or operators working under a company.

The first user is created through landing-page signup and onboarding.

### Material

Represents a rentable item or material.

Required business data:

- material name
- unit
- default price
- owner company

### Rental

Represents one rental case between two parties.

Required business data:

- owner company
- renter company
- start date
- optional end date
- status
- notes

Suggested statuses:

- `OPEN`
- `CLOSED`
- `CANCELLED`

### RentalMovement

Represents operational movement of materials.

Each movement belongs to one rental and one material.

Movement types:

- `OUT` = material given to renter
- `RETURN` = material received back

Required business data:

- rental
- material
- movement type
- quantity
- movement date
- unit price
- notes

### Settlement

Represents the financial calculation for a rental or a rental period.

Required business data:

- rental
- period start
- period end
- subtotal
- tax
- total
- status

Suggested statuses:

- `DRAFT`
- `CONFIRMED`
- `PAID`
- `CANCELLED`

## Operational Screens

The MVP should mainly revolve around these screens:

### 1. Landing Page

Purpose:

- present the product
- drive signup

### 2. Signup / Onboarding

Purpose:

- collect user information
- collect company information
- create the initial workspace

### 3. Dashboard

This is the first screen after signup.

It should show top-level operational summary.

Required summary cards:

- total material count
- total rented out material count
- total rented in material count

Definitions:

- total material count = total registered materials in the user's company
- total rented out material count = materials this company has given out to others
- total rented in material count = materials this company has received as renter

Dashboard can later grow, but these three KPIs are mandatory in the first MVP.

### 4. Materials

Purpose:

- register materials
- edit material information
- set default price

### 5. Rentals

Purpose:

- create rental records
- select owner and renter companies
- track current operational status

### 6. Rental Detail

This is the most important screen in the system.

It should contain:

- rental header information
- movement entry form
- movement table
- live remaining balance

### 7. Settlements

Purpose:

- calculate money based on rental movements
- show financial summary
- track payment status

## Main Tables

Two tables are required in the MVP.

### Table A: Material Movement Table

This table shows operational flow.

Recommended columns:

- date
- material
- given out quantity
- returned quantity
- unit price
- remaining balance
- notes

Business meaning:

- users can see when material was given
- users can see when material was returned
- users can see how much is still outstanding

### Table B: Settlement Table

This table shows financial flow.

Recommended columns:

- rental
- period
- material
- total out
- total returned
- billable remaining or billable usage
- unit price
- line total

Business meaning:

- users can see how payment was calculated
- finance can review subtotal, tax, and total clearly

## Core Business Rules

These rules should guide both backend and UI behavior.

1. A rental must exist before any movement can be recorded.
2. A material must exist before it can be added to a movement.
3. Default price comes from the material record.
4. Unit price may be overridden during movement entry if needed.
5. `RETURN` quantity cannot exceed current remaining balance.
6. Remaining balance is calculated as:

`sum(OUT) - sum(RETURN)`

7. A rental can contain multiple movements for the same material.
8. A rental can be closed only when:

- all material remaining balances are zero, and
- settlement is completed or no more billing is pending

## What Is Not In Scope For The First MVP

These are intentionally excluded for now:

- master contract flow
- contract-based pricing table
- separate handover act workflow
- complex approval pipeline
- role-based permission matrix
- advanced analytics dashboard

## Open Decisions For Later

These items are still product decisions, not finalized logic:

- whether settlement is generated per rental or per date range
- whether billing is quantity-based, day-based, or both
- whether separate printable documents are needed
- whether the same material can have multiple pricing modes

## Working Rule

Before changing schema, UI structure, or resolver behavior, check this file
first. If the workflow changes, update this document before implementation.
