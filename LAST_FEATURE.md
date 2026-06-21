# OKR Feature - Backend API Documentation

## Overview

OKR (Objectives and Key Results) feature для управления целями и ключевыми результатами в workspace. Реализовано в ветке `feature/okr-implementation`.

---

## Base URL

```
/api/workspaces/:workspaceId/objectives
```

---

## Data Models

### Objective

```typescript
{
  _id: string;
  workspaceId: string;
  title: string;
  period: {
    start: Date;
    end: Date;
  };
  status: 'active' | 'completed' | 'archived';
  key_results: KeyResult[];
  progress: number; // виртуальное поле [0, 1] — взвешенное среднее metric_progress всех KR
  createdAt: Date;
  updatedAt: Date;
}
```

### KeyResult

```typescript
{
  _id: string;
  title: string;
  status: 'not_started' | 'on_track' | 'at_risk' | 'off_track' | 'completed' | 'cancelled';
  projects: Array<{ id: string; title: string }>;
  metric?: KRMetric;
  metric_progress: number; // [0, 1] — прогресс по метрике
  project_progress: number; // [0, 1] — прогресс по проектам (completedTasks / totalTasks)
  weight: number; // [0, 1] — вес KR в общем прогрессе Objective
  owner_id: string; // ID пользователя-владельца KR
}
```

### KRMetric

**Number Metric:**
```typescript
{
  type: 'number';
  direction: 'increase' | 'decrease';
  unit?: string; // например "users", "%", "revenue" и т.д.
  start: number;
  current: number;
  target: number;
}
```

**Boolean Metric:**
```typescript
{
  type: 'boolean';
  current: boolean;
  target: true; // всегда true
}
```

---

## API Endpoints

### 1. Get All Objectives

```http
GET /api/workspaces/:workspaceId/objectives
```

**Authorization:** Required (JWT token)

**Response 200:**
```json
{
  "success": true,
  "objectives": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "workspaceId": "507f1f77bcf86cd799439012",
      "title": "Increase user engagement",
      "period": {
        "start": "2026-01-01T00:00:00.000Z",
        "end": "2026-03-31T23:59:59.999Z"
      },
      "status": "active",
      "key_results": [],
      "progress": 0,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "totalCount": 1
}
```

**Response 400:** Invalid workspace ID
**Response 403:** Access denied (not a workspace member)
**Response 404:** Workspace not found

---

### 2. Get Single Objective

```http
GET /api/workspaces/:workspaceId/objectives/:objectiveId
```

**Authorization:** Required (JWT token)

**Response 200:**
```json
{
  "success": true,
  "objective": {
    "_id": "507f1f77bcf86cd799439011",
    "workspaceId": "507f1f77bcf86cd799439012",
    "title": "Increase user engagement",
    "period": {
      "start": "2026-01-01T00:00:00.000Z",
      "end": "2026-03-31T23:59:59.999Z"
    },
    "status": "active",
    "key_results": [],
    "progress": 0,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Response 400:** Invalid ID format
**Response 404:** Objective not found

---

### 3. Create Objective

```http
POST /api/workspaces/:workspaceId/objectives
```

**Authorization:** Required (JWT token)
**Permissions:** `OWNER` or `ADMIN` with `accessType: organizational`

**Request Body:**
```json
{
  "title": "Increase user engagement",
  "period": {
    "start": "2026-01-01T00:00:00.000Z",
    "end": "2026-03-31T23:59:59.999Z"
  },
  "status": "active"
}
```

**Required Fields:**
- `title` (string)
- `period.start` (ISO date string)
- `period.end` (ISO date string)

**Optional Fields:**
- `status` (enum: `active`, `completed`, `archived`) - default: `active`

**Validation:**
- `period.start` must be before `period.end`

**Response 201:**
```json
{
  "success": true,
  "objective": {
    "_id": "507f1f77bcf86cd799439011",
    "workspaceId": "507f1f77bcf86cd799439012",
    "title": "Increase user engagement",
    "period": {
      "start": "2026-01-01T00:00:00.000Z",
      "end": "2026-03-31T23:59:59.999Z"
    },
    "status": "active",
    "key_results": [],
    "progress": 0,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

**Response 400:** Invalid data or validation error
**Response 403:** Insufficient permissions

---

### 4. Update Objective

```http
PATCH /api/workspaces/:workspaceId/objectives/:objectiveId
```

**Authorization:** Required (JWT token)
**Permissions:** `OWNER` or `ADMIN` with `accessType: organizational`

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "period": {
    "start": "2026-01-01T00:00:00.000Z",
    "end": "2026-06-30T23:59:59.999Z"
  },
  "status": "completed"
}
```

**Response 200:**
```json
{
  "success": true,
  "objective": {
    // updated objective
  }
}
```

**Response 400:** Invalid data
**Response 404:** Objective not found

---

### 5. Delete Objective

```http
DELETE /api/workspaces/:workspaceId/objectives/:objectiveId
```

**Authorization:** Required (JWT token)
**Permissions:** `OWNER` or `ADMIN` with `accessType: organizational`

**Response 200:**
```json
{
  "success": true,
  "message": "Objective deleted"
}
```

**Response 404:** Objective not found

---

### 6. Add Key Result

```http
POST /api/workspaces/:workspaceId/objectives/:objectiveId/key-results
```

**Authorization:** Required (JWT token)
**Permissions:** `OWNER` or `ADMIN` with `accessType: organizational`

**Request Body:**
```json
{
  "title": "Increase DAU to 10k",
  "owner_id": "507f1f77bcf86cd799439011",
  "weight": 0.4,
  "metric": {
    "type": "number",
    "direction": "increase",
    "unit": "users",
    "start": 5000,
    "current": 5000,
    "target": 10000
  },
  "projects": [
    {
      "id": "board_id_1",
      "title": "Marketing Campaign"
    }
  ]
}
```

**Required Fields:**
- `title` (string)
- `owner_id` (string, valid ObjectId, must be workspace member)
- `weight` (number, range [0, 1])

**Optional Fields:**
- `metric` (KRMetric object)
- `projects` (array of {id, title})

**Validation:**
- `owner_id` must be a member of the workspace
- Sum of all KR weights in the objective must equal 1.0 (±0.01)

**Response 201:**
```json
{
  "success": true,
  "objective": {
    // updated objective with new key result
  }
}
```

**Response 400:** Invalid data or weight sum validation failed
**Response 403:** Insufficient permissions

---

### 7. Update Key Result

```http
PATCH /api/workspaces/:workspaceId/objectives/:objectiveId/key-results/:krId
```

**Authorization:** Required (JWT token)
**Permissions:** `OWNER` or `ADMIN` with `accessType: organizational`

**Request Body (all fields optional):**
```json
{
  "title": "Updated KR title",
  "weight": 0.5,
  "owner_id": "507f1f77bcf86cd799439011",
  "status": "on_track",
  "projects": [
    {
      "id": "board_id_2",
      "title": "New Project"
    }
  ]
}
```

**Validation:**
- If `weight` is updated, sum of all KR weights must equal 1.0 (±0.01)
- If `owner_id` is updated, must be a workspace member

**Response 200:**
```json
{
  "success": true,
  "objective": {
    // updated objective
  }
}
```

**Response 400:** Invalid data or validation error
**Response 404:** Key result not found

---

### 8. Delete Key Result

```http
DELETE /api/workspaces/:workspaceId/objectives/:objectiveId/key-results/:krId
```

**Authorization:** Required (JWT token)
**Permissions:** `OWNER` or `ADMIN` with `accessType: organizational`

**Response 200:**
```json
{
  "success": true,
  "objective": {
    // updated objective without deleted key result
  }
}
```

**Response 404:** Key result not found

---

### 9. Start Key Result

```http
POST /api/workspaces/:workspaceId/objectives/:objectiveId/key-results/:krId/start
```

**Authorization:** Required (JWT token)
**Permissions:** `OWNER`, `ADMIN`, or `MEMBER` with `accessType: organizational`

**Description:** Transitions KR status from `not_started` to `on_track`

**Response 200:**
```json
{
  "success": true,
  "objective": {
    // updated objective
  }
}
```

**Response 409:**
```json
{
  "success": false,
  "message": "KR is already started (status: on_track)"
}
```

---

### 10. Update Key Result Metric Current Value

```http
PATCH /api/workspaces/:workspaceId/objectives/:objectiveId/key-results/:krId/metric
```

**Authorization:** Required (JWT token)
**Permissions:** `OWNER` or `ADMIN` with `accessType: organizational`

**Request Body (for number metric):**
```json
{
  "current": 7500
}
```

**Request Body (for boolean metric):**
```json
{
  "current": true
}
```

**Description:** Updates `metric.current` and automatically recalculates `metric_progress`

**Metric Progress Calculation:**
- **Number metric (increase):** `(current - start) / (target - start)`, clamped to [0, 1]
- **Number metric (decrease):** `(start - current) / (start - target)`, clamped to [0, 1]
- **Boolean metric:** `1` if `current === true`, else `0`

**Response 200:**
```json
{
  "success": true,
  "objective": {
    // updated objective with recalculated metric_progress
  }
}
```

**Response 409:**
```json
{
  "success": false,
  "message": "This KR has no metric defined"
}
```

---

## Permissions Matrix

| Action | OWNER | ADMIN (organizational) | MEMBER (organizational) | VIEWER |
|--------|-------|------------------------|-------------------------|--------|
| View Objectives | ✅ | ✅ | ✅ | ✅ |
| Create/Update/Delete Objective | ✅ | ✅ | ❌ | ❌ |
| Create/Update/Delete Key Result | ✅ | ✅ | ❌ | ❌ |
| Start Key Result | ✅ | ✅ | ✅ | ❌ |
| Update Key Result Metric | ✅ | ✅ | ❌ | ❌ |

**Important:** Only users with `accessType: organizational` have access to OKR features. Users with `accessType: personal` cannot access OKR endpoints.

---

## Business Logic

### 1. Key Result Weight Validation

When adding or updating a Key Result, the backend validates that the sum of all `weight` values in the Objective equals 1.0 (with tolerance ±0.01).

**Example:**
```
KR1: weight = 0.3
KR2: weight = 0.5
KR3: weight = 0.2
Total: 1.0 ✅
```

If validation fails, the API returns a 400 error:
```json
{
  "success": false,
  "message": "Total weight of key results must sum to 1.0"
}
```

### 2. Objective Progress Calculation

The `progress` field is a virtual field calculated as the weighted average of all Key Results' `metric_progress`:

```
progress = Σ(kr.metric_progress × kr.weight)
```

**Example:**
```
KR1: metric_progress = 0.8, weight = 0.4 → contribution = 0.32
KR2: metric_progress = 0.5, weight = 0.6 → contribution = 0.30
Objective progress = 0.32 + 0.30 = 0.62 (62%)
```

### 3. Key Result Status Transitions

- `not_started` → `on_track`: via `/start` endpoint
- Other status changes (`at_risk`, `off_track`, `completed`, `cancelled`): via PATCH `/key-results/:krId`

### 4. Owner Validation

The `owner_id` field must reference a user who is a member of the workspace. The backend validates this on KR creation and update.

### 5. Metric Progress Auto-calculation

When updating `metric.current` via the `/metric` endpoint, the backend automatically recalculates `metric_progress` based on the metric type and direction.

---

## Error Responses

### Common Error Codes

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Invalid workspace ID format"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Objective not found"
}
```

**409 Conflict:**
```json
{
  "success": false,
  "message": "KR is already started (status: on_track)"
}
```

---

## Example Usage Flow

### 1. Create an Objective

```bash
POST /api/workspaces/507f1f77bcf86cd799439012/objectives
{
  "title": "Q1 2026 Growth Goals",
  "period": {
    "start": "2026-01-01T00:00:00.000Z",
    "end": "2026-03-31T23:59:59.999Z"
  }
}
```

### 2. Add Key Results (weights must sum to 1.0)

```bash
POST /api/workspaces/507f1f77bcf86cd799439012/objectives/507f1f77bcf86cd799439011/key-results
{
  "title": "Increase DAU to 10k",
  "owner_id": "507f1f77bcf86cd799439013",
  "weight": 0.5,
  "metric": {
    "type": "number",
    "direction": "increase",
    "unit": "users",
    "start": 5000,
    "current": 5000,
    "target": 10000
  }
}

POST /api/workspaces/507f1f77bcf86cd799439012/objectives/507f1f77bcf86cd799439011/key-results
{
  "title": "Launch mobile app",
  "owner_id": "507f1f77bcf86cd799439014",
  "weight": 0.5,
  "metric": {
    "type": "boolean",
    "current": false,
    "target": true
  }
}
```

### 3. Start a Key Result

```bash
POST /api/workspaces/507f1f77bcf86cd799439012/objectives/507f1f77bcf86cd799439011/key-results/507f1f77bcf86cd799439015/start
```

### 4. Update Metric Progress

```bash
PATCH /api/workspaces/507f1f77bcf86cd799439012/objectives/507f1f77bcf86cd799439011/key-results/507f1f77bcf86cd799439015/metric
{
  "current": 7500
}
```

### 5. Check Objective Progress

```bash
GET /api/workspaces/507f1f77bcf86cd799439012/objectives/507f1f77bcf86cd799439011
```

Response will include calculated `progress` field based on weighted KR progress.

---

## Notes for Frontend Development

1. **Weight Management:** When adding/editing KRs, ensure the UI helps users maintain a total weight of 1.0 across all KRs in an objective.

2. **Progress Visualization:** The `progress` field is automatically calculated, so you can directly use it for progress bars.

3. **Metric Types:** Handle both number and boolean metrics in the UI. Boolean metrics are simpler (checkbox), while number metrics need input fields and direction indicators.

4. **Permission Checks:** Disable edit/delete buttons for users without `organizational` access or insufficient roles.

5. **Status Colors:** Consider color-coding KR statuses:
   - `not_started`: gray
   - `on_track`: green
   - `at_risk`: yellow
   - `off_track`: red
   - `completed`: blue
   - `cancelled`: gray

6. **Date Handling:** All dates are in ISO 8601 format. Convert to local timezone for display.

7. **Owner Selection:** When creating/editing KRs, fetch workspace members and allow selection from that list.

---
