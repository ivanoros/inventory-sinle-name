/*
  Sybase ASE script for storing AG Grid layout preferences.

  Frontend endpoint mapping:
    GET    /api/grid-layouts/{layoutKey}
    PUT    /api/grid-layouts/{layoutKey}/active
    PUT    /api/grid-layouts/{layoutKey}/layouts/{layoutName}
    DELETE /api/grid-layouts/{layoutKey}/layouts/{layoutName}

  Notes:
    - layout_state_json stores the AG Grid state exactly as sent by the UI.
    - Sybase ASE does not provide SQL Server's filtered indexes or ISJSON check
      constraints, so the "one active layout per user/page" rule is modeled with
      a separate active table.
    - Single Name stores both grids in the same layout_state_json value:
        { "grids": { "single-name-drilldown": {...}, "single-name-lender": {...} } }
*/

if object_id('dbo.grid_layout_active_preference') is not null
    drop table dbo.grid_layout_active_preference
go

if object_id('dbo.grid_layout_preference') is not null
    drop table dbo.grid_layout_preference
go

create table dbo.grid_layout_preference
(
    grid_layout_preference_id numeric(18,0) identity not null,
    user_id varchar(128) not null,
    layout_key varchar(128) not null,
    layout_name varchar(128) not null,
    layout_state_json text not null,
    created_at datetime not null default getdate(),
    updated_at datetime not null default getdate(),

    constraint pk_grid_layout_preference
        primary key clustered (grid_layout_preference_id),
    constraint uq_grid_layout_preference_user_key_name
        unique nonclustered (user_id, layout_key, layout_name),
    constraint ck_grid_layout_preference_user_id
        check (char_length(ltrim(rtrim(user_id))) > 0),
    constraint ck_grid_layout_preference_layout_key
        check (char_length(ltrim(rtrim(layout_key))) > 0),
    constraint ck_grid_layout_preference_layout_name
        check (char_length(ltrim(rtrim(layout_name))) > 0),
    constraint ck_grid_layout_preference_layout_name_default
        check (lower(ltrim(rtrim(layout_name))) != 'default')
)
go

create unique nonclustered index ux_grid_layout_preference_id_user_key
    on dbo.grid_layout_preference (grid_layout_preference_id, user_id, layout_key)
go

create table dbo.grid_layout_active_preference
(
    user_id varchar(128) not null,
    layout_key varchar(128) not null,
    grid_layout_preference_id numeric(18,0) not null,
    updated_at datetime not null default getdate(),

    constraint pk_grid_layout_active_preference
        primary key clustered (user_id, layout_key),
    constraint fk_grid_layout_active_preference_layout
        foreign key (grid_layout_preference_id, user_id, layout_key)
        references dbo.grid_layout_preference (grid_layout_preference_id, user_id, layout_key)
)
go

create nonclustered index ix_grid_layout_preference_user_key
    on dbo.grid_layout_preference (user_id, layout_key)
go

create nonclustered index ix_grid_layout_active_preference_layout
    on dbo.grid_layout_active_preference (grid_layout_preference_id)
go

create trigger dbo.tr_grid_layout_preference_set_updated_at
on dbo.grid_layout_preference
for update
as
begin
    update dbo.grid_layout_preference
    set updated_at = getdate()
    from dbo.grid_layout_preference preference, inserted updated
    where preference.grid_layout_preference_id = updated.grid_layout_preference_id
end
go

create trigger dbo.tr_grid_layout_active_preference_set_updated_at
on dbo.grid_layout_active_preference
for update
as
begin
    update dbo.grid_layout_active_preference
    set updated_at = getdate()
    from dbo.grid_layout_active_preference active_preference, inserted updated
    where active_preference.user_id = updated.user_id
      and active_preference.layout_key = updated.layout_key
end
go
