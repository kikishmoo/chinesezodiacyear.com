# Birth Data Governance Policy (Item N)

**Status:** Active  
**Effective date:** 2026-03-27  
**Scope:** `worker/*`, D1 tables handling user birth data, report generation flows, and support/audit operations.

---

## 1) Purpose

This policy defines retention, deletion, and access controls for personal birth data used by BaZi and report-generation services.

## 2) Data classes

### 2.1 Restricted PII (highest sensitivity)

- Full birth date/time
- Birth location text
- Email address linked to report purchase
- Raw request payloads that can reconstruct a person’s chart inputs

### 2.2 Operational metadata (medium sensitivity)

- Report job IDs
- Transaction IDs
- Processing status and timestamps

### 2.3 Public/non-PII (low sensitivity)

- Static report templates
- Non-user-specific catalogue/product records

## 3) Collection and minimisation rules

1. Collect only fields required to compute chart outputs and deliver purchased reports.
2. Do not store unnecessary free-form notes in report-job payload fields.
3. Do not log full raw birth payloads in application logs.
4. Prefer identifiers/references over duplicating raw personal data across tables.

## 4) Retention windows

- **Raw birth payload data:** retain for **30 days** from report job creation; then delete or irreversibly redact.
- **Generated report files in R2:** retain for **30 days** from generation; then delete object.
- **Transaction/accounting records:** retain for **365 days** minimum for reconciliation/fraud handling.
- **Aggregated analytics metrics (non-PII):** retain per analytics platform defaults.

## 5) Deletion workflow (SOP)

### 5.1 User-initiated deletion

1. Verify requestor identity against purchase email or signed account context.
2. Create deletion ticket with request timestamp and scope.
3. Delete/redact restricted fields in D1 tables (`report_jobs`, `transactions`, related payload columns).
4. Delete associated report artifacts in R2.
5. Record completion timestamp + operator ID in deletion audit log.
6. Return confirmation to requester.

### 5.2 Scheduled expiry deletion

- Run daily cleanup job to remove records/artifacts past retention windows.
- Write one audit event per batch run with counts deleted and failures.

## 6) Access control and least privilege

- Production read access to restricted data is limited to service runtime and approved operators.
- No ad hoc manual SQL against restricted fields without incident/ticket reference.
- Access to deletion tooling requires authenticated admin role and audit trail.

## 7) Audit logging requirements

Each access/deletion event must include:

- actor (service or operator)
- action (`read_sensitive`, `delete_sensitive`, `export_sensitive`)
- target record IDs (or batch range)
- timestamp (UTC)
- outcome (`success` / `failed`) and failure reason if any

## 8) Incident response

If over-retention or unauthorised access is detected:

1. Stop affected job/process.
2. Contain and rotate credentials/tokens as needed.
3. Run corrective deletion for over-retained data.
4. Document incident + remediation in `CHANGELOG.md` and ops notes.

## 9) Implementation checklist

- [ ] Add scheduled deletion Worker/cron route for D1 + R2 cleanup.
- [ ] Add admin-protected deletion endpoint/SOP implementation.
- [ ] Add structured audit-log sink for sensitive operations.
- [ ] Add tests that assert TTL/deletion behavior for report jobs.
