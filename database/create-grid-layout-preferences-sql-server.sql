/*
  SQL Server script for storing AG Grid layout preferences.

  Frontend endpoint mapping:
    GET    /api/grid-layouts/{layoutKey}
    PUT    /api/grid-layouts/{layoutKey}/active
    PUT    /api/grid-layouts/{layoutKey}/layouts/{layoutName}
    DELETE /api/grid-layouts/{layoutKey}/layouts/{layoutName}

  Notes:
    - LayoutStateJson stores the AG Grid state exactly as sent by the UI.
    - Single Name stores both grids in the same JSON value:
        { "grids": { "single-name-drilldown": {...}, "single-name-lender": {...} } }
    - The filtered unique index allows only one active layout per user + page.
*/

CREATE TABLE dbo.GridLayoutPreference (
    GridLayoutPreferenceId UNIQUEIDENTIFIER NOT NULL
        CONSTRAINT PK_GridLayoutPreference PRIMARY KEY
        CONSTRAINT DF_GridLayoutPreference_Id DEFAULT NEWSEQUENTIALID(),

    UserId NVARCHAR(128) NOT NULL,
    LayoutKey NVARCHAR(128) NOT NULL,
    LayoutName NVARCHAR(128) NOT NULL,
    LayoutStateJson NVARCHAR(MAX) NOT NULL,
    IsActive BIT NOT NULL
        CONSTRAINT DF_GridLayoutPreference_IsActive DEFAULT (0),

    CreatedAtUtc DATETIME2(3) NOT NULL
        CONSTRAINT DF_GridLayoutPreference_CreatedAtUtc DEFAULT SYSUTCDATETIME(),
    UpdatedAtUtc DATETIME2(3) NOT NULL
        CONSTRAINT DF_GridLayoutPreference_UpdatedAtUtc DEFAULT SYSUTCDATETIME(),
    RowVersion ROWVERSION NOT NULL,

    CONSTRAINT CK_GridLayoutPreference_UserId_NotBlank
        CHECK (LEN(LTRIM(RTRIM(UserId))) > 0),
    CONSTRAINT CK_GridLayoutPreference_LayoutKey_NotBlank
        CHECK (LEN(LTRIM(RTRIM(LayoutKey))) > 0),
    CONSTRAINT CK_GridLayoutPreference_LayoutName_NotBlank
        CHECK (LEN(LTRIM(RTRIM(LayoutName))) > 0),
    CONSTRAINT CK_GridLayoutPreference_LayoutName_NotDefault
        CHECK (LOWER(LTRIM(RTRIM(LayoutName))) <> N'default'),
    CONSTRAINT CK_GridLayoutPreference_LayoutStateJson_IsJson
        CHECK (ISJSON(LayoutStateJson) = 1)
);
GO

CREATE UNIQUE INDEX UX_GridLayoutPreference_User_Key_Name
    ON dbo.GridLayoutPreference (UserId, LayoutKey, LayoutName);
GO

CREATE UNIQUE INDEX UX_GridLayoutPreference_User_Key_Active
    ON dbo.GridLayoutPreference (UserId, LayoutKey)
    WHERE IsActive = 1;
GO

CREATE INDEX IX_GridLayoutPreference_User_Key
    ON dbo.GridLayoutPreference (UserId, LayoutKey)
    INCLUDE (LayoutName, IsActive, UpdatedAtUtc);
GO

CREATE OR ALTER TRIGGER dbo.TR_GridLayoutPreference_SetUpdatedAtUtc
ON dbo.GridLayoutPreference
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE preference
    SET UpdatedAtUtc = SYSUTCDATETIME()
    FROM dbo.GridLayoutPreference preference
    INNER JOIN inserted updated
        ON updated.GridLayoutPreferenceId = preference.GridLayoutPreferenceId;
END;
GO
