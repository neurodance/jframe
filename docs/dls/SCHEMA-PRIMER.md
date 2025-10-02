# DLS Schema Primer

Sources: `DLS.Website/Data/DLS DB (T-SQL)/DLSDB.sql`

## Key Entities
- Account (Id, PrimaryEmail, flags for roles)
- Contact (unique Email_1)
- Domain (Name, AccountId, Registrar, Whois fields)
- DomainProfile (by Account; purpose/audience/value props; SubscriptionLevel)
- DomainDomainProfile (link table; IsDefault, ActiveForGeneration, LastPublishedAt)
- Status (taxonomy)
- ASP.NET Identity tables (users/roles/claims)

## Relationships (observed)
- Contact.Email_1 ↔ Account.PrimaryEmail (via vwContacts join)
- Domain.AccountId → Account.Id
- DomainDomainProfile.DomainId → Domain.Id
- DomainDomainProfile.DomainProfileId → DomainProfile.Id

## Observations / Gaps
- Consider explicit foreign keys for all relations (some are implied only)
- Ensure uniqueness constraints: Domain.Name, Account.PrimaryEmail, DomainProfile (AccountId, Name)
- Add audit columns consistently (CreatedAt/UpdatedAt/DeletedAt) across all tables
- Introduce valuation table(s): DomainValuation, Events (metrics, DNS, publish state) for Flipdot
- Model transactions (buy/sell/lease): Orders, OrderLines, Payments (Stripe), Leases
- Model feature/capability attachments per domain with versioning

## Proposed Additions (Flipdot-friendly)
- DomainEvent(Id, DomainId, EventType, Data JSON, OccurredAt)
- DomainValuation(Id, DomainId, Score, Inputs JSON, CalculatedAt)
- Listing(Id, DomainId, Type: Sale/Lease, Price, Terms, Status)
- ListingChange(Id, ListingId, Diff JSON, ChangedAt, ChangedBy)
- Feature(Id, Key, Name, Schema JSON)
- DomainFeature(Id, DomainId, FeatureId, Config JSON, Active, CreatedAt)
- Order(Id, AccountId, Total, Status, CreatedAt)
- OrderLine(Id, OrderId, DomainId?, FeatureId?, Price)
- Payment(Id, OrderId, Provider, ProviderRef, Amount, Status, CreatedAt)

## Next Steps
- Add missing FKs and unique indexes in migrations
- Create materialized views for dashboards (e.g., portfolio valuation over time)
- Define data retention and soft-delete strategy
- Draft ER diagram and ADR for schema evolution principles
