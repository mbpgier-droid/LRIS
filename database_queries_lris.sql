-- =============================================
-- Learning Resources Inventory System - Subjects Database
-- SQL Server Management Studio (SSMS) Queries
-- For existing LRIS database
-- =============================================

USE LRIS;
GO

-- Create Subjects table in existing LRIS database
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Subjects]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Subjects] (
        [SubjectID] INT IDENTITY(1,1) PRIMARY KEY,
        [SubjectName] NVARCHAR(100) NOT NULL,
        [GradeLevel] NVARCHAR(20) NOT NULL,
        [DateAdded] DATETIME DEFAULT GETDATE(),
        [DateModified] DATETIME DEFAULT GETDATE(),
        [IsActive] BIT DEFAULT 1,
        [CreatedBy] NVARCHAR(50) DEFAULT 'Admin',
        [ModifiedBy] NVARCHAR(50) DEFAULT 'Admin'
    );
    
    PRINT 'Subjects table created successfully in LRIS database.';
END
ELSE
BEGIN
    PRINT 'Subjects table already exists in LRIS database.';
END
GO

-- Create index for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Subjects_GradeLevel')
BEGIN
    CREATE INDEX IX_Subjects_GradeLevel ON [dbo].[Subjects] ([GradeLevel]);
    PRINT 'Index IX_Subjects_GradeLevel created successfully.';
END
GO

-- Create index for subject name searches
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Subjects_SubjectName')
BEGIN
    CREATE INDEX IX_Subjects_SubjectName ON [dbo].[Subjects] ([SubjectName]);
    PRINT 'Index IX_Subjects_SubjectName created successfully.';
END
GO

-- =============================================
-- STORED PROCEDURES FOR SUBJECT MANAGEMENT
-- =============================================

-- Stored Procedure: Add Subject
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_AddSubject]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_AddSubject]
GO

CREATE PROCEDURE [dbo].[sp_AddSubject]
    @SubjectName NVARCHAR(100),
    @GradeLevel NVARCHAR(20),
    @CreatedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO [dbo].[Subjects] ([SubjectName], [GradeLevel], [CreatedBy])
        VALUES (@SubjectName, @GradeLevel, @CreatedBy);
        
        SELECT SCOPE_IDENTITY() AS SubjectID;
        
        PRINT 'Subject added successfully.';
    END TRY
    BEGIN CATCH
        PRINT 'Error adding subject: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Stored Procedure: Add Multiple Subjects
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_AddMultipleSubjects]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_AddMultipleSubjects]
GO

CREATE PROCEDURE [dbo].[sp_AddMultipleSubjects]
    @GradeLevel NVARCHAR(20),
    @SubjectNames NVARCHAR(MAX), -- Comma-separated list of subject names
    @CreatedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Split the comma-separated subject names
        DECLARE @SubjectName NVARCHAR(100);
        DECLARE @StartPos INT = 1;
        DECLARE @EndPos INT;
        
        WHILE @StartPos <= LEN(@SubjectNames)
        BEGIN
            SET @EndPos = CHARINDEX(',', @SubjectNames, @StartPos);
            IF @EndPos = 0
                SET @EndPos = LEN(@SubjectNames) + 1;
                
            SET @SubjectName = LTRIM(RTRIM(SUBSTRING(@SubjectNames, @StartPos, @EndPos - @StartPos)));
            
            IF LEN(@SubjectName) > 0
            BEGIN
                INSERT INTO [dbo].[Subjects] ([SubjectName], [GradeLevel], [CreatedBy])
                VALUES (@SubjectName, @GradeLevel, @CreatedBy);
            END
            
            SET @StartPos = @EndPos + 1;
        END
        
        COMMIT TRANSACTION;
        PRINT 'Multiple subjects added successfully for ' + @GradeLevel;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        PRINT 'Error adding multiple subjects: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Stored Procedure: Get All Subjects
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetAllSubjects]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_GetAllSubjects]
GO

CREATE PROCEDURE [dbo].[sp_GetAllSubjects]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        [SubjectID],
        [SubjectName],
        [GradeLevel],
        [DateAdded],
        [DateModified],
        [IsActive]
    FROM [dbo].[Subjects]
    WHERE [IsActive] = 1
    ORDER BY 
        CASE [GradeLevel]
            WHEN 'Kindergarten' THEN 0
            WHEN 'Grade 1' THEN 1
            WHEN 'Grade 2' THEN 2
            WHEN 'Grade 3' THEN 3
            WHEN 'Grade 4' THEN 4
            WHEN 'Grade 5' THEN 5
            WHEN 'Grade 6' THEN 6
            WHEN 'Grade 7' THEN 7
            WHEN 'Grade 8' THEN 8
            WHEN 'Grade 9' THEN 9
            WHEN 'Grade 10' THEN 10
            WHEN 'Grade 11' THEN 11
            WHEN 'Grade 12' THEN 12
            ELSE 13
        END,
        [SubjectName];
END
GO

-- Stored Procedure: Get Subjects by Grade Level
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetSubjectsByGradeLevel]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_GetSubjectsByGradeLevel]
GO

CREATE PROCEDURE [dbo].[sp_GetSubjectsByGradeLevel]
    @GradeLevel NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        [SubjectID],
        [SubjectName],
        [GradeLevel],
        [DateAdded],
        [DateModified]
    FROM [dbo].[Subjects]
    WHERE [GradeLevel] = @GradeLevel AND [IsActive] = 1
    ORDER BY [SubjectName];
END
GO

-- Stored Procedure: Update Subject
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_UpdateSubject]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_UpdateSubject]
GO

CREATE PROCEDURE [dbo].[sp_UpdateSubject]
    @SubjectID INT,
    @SubjectName NVARCHAR(100),
    @GradeLevel NVARCHAR(20),
    @ModifiedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE [dbo].[Subjects]
        SET 
            [SubjectName] = @SubjectName,
            [GradeLevel] = @GradeLevel,
            [DateModified] = GETDATE(),
            [ModifiedBy] = @ModifiedBy
        WHERE [SubjectID] = @SubjectID;
        
        IF @@ROWCOUNT > 0
            PRINT 'Subject updated successfully.';
        ELSE
            PRINT 'Subject not found.';
    END TRY
    BEGIN CATCH
        PRINT 'Error updating subject: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Stored Procedure: Update Multiple Subjects for Grade Level
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_UpdateSubjectsForGradeLevel]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_UpdateSubjectsForGradeLevel]
GO

CREATE PROCEDURE [dbo].[sp_UpdateSubjectsForGradeLevel]
    @GradeLevel NVARCHAR(20),
    @SubjectNames NVARCHAR(MAX), -- Comma-separated list of new subject names
    @ModifiedBy NVARCHAR(50) = 'Admin'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- First, deactivate all existing subjects for this grade level
        UPDATE [dbo].[Subjects]
        SET 
            [IsActive] = 0,
            [DateModified] = GETDATE(),
            [ModifiedBy] = @ModifiedBy
        WHERE [GradeLevel] = @GradeLevel AND [IsActive] = 1;
        
        -- Then add the new subjects
        DECLARE @SubjectName NVARCHAR(100);
        DECLARE @StartPos INT = 1;
        DECLARE @EndPos INT;
        
        WHILE @StartPos <= LEN(@SubjectNames)
        BEGIN
            SET @EndPos = CHARINDEX(',', @SubjectNames, @StartPos);
            IF @EndPos = 0
                SET @EndPos = LEN(@SubjectNames) + 1;
                
            SET @SubjectName = LTRIM(RTRIM(SUBSTRING(@SubjectNames, @StartPos, @EndPos - @StartPos)));
            
            IF LEN(@SubjectName) > 0
            BEGIN
                INSERT INTO [dbo].[Subjects] ([SubjectName], [GradeLevel], [CreatedBy])
                VALUES (@SubjectName, @GradeLevel, @ModifiedBy);
            END
            
            SET @StartPos = @EndPos + 1;
        END
        
        COMMIT TRANSACTION;
        PRINT 'Subjects updated successfully for ' + @GradeLevel;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        PRINT 'Error updating subjects: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Stored Procedure: Delete Subject
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_DeleteSubject]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_DeleteSubject]
GO

CREATE PROCEDURE [dbo].[sp_DeleteSubject]
    @SubjectID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE [dbo].[Subjects]
        SET [IsActive] = 0, [DateModified] = GETDATE()
        WHERE [SubjectID] = @SubjectID;
        
        IF @@ROWCOUNT > 0
            PRINT 'Subject deleted successfully.';
        ELSE
            PRINT 'Subject not found.';
    END TRY
    BEGIN CATCH
        PRINT 'Error deleting subject: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- Stored Procedure: Delete All Subjects for Grade Level
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_DeleteSubjectsForGradeLevel]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_DeleteSubjectsForGradeLevel]
GO

CREATE PROCEDURE [dbo].[sp_DeleteSubjectsForGradeLevel]
    @GradeLevel NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE [dbo].[Subjects]
        SET [IsActive] = 0, [DateModified] = GETDATE()
        WHERE [GradeLevel] = @GradeLevel AND [IsActive] = 1;
        
        PRINT 'All subjects deleted for ' + @GradeLevel;
    END TRY
    BEGIN CATCH
        PRINT 'Error deleting subjects: ' + ERROR_MESSAGE();
        THROW;
    END CATCH
END
GO

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert sample subjects for different grade levels
INSERT INTO [dbo].[Subjects] ([SubjectName], [GradeLevel], [CreatedBy])
VALUES 
    ('Mathematics', 'Grade 1', 'Admin'),
    ('Science', 'Grade 1', 'Admin'),
    ('English', 'Grade 1', 'Admin'),
    ('Filipino', 'Grade 1', 'Admin'),
    ('Mathematics', 'Grade 2', 'Admin'),
    ('Science', 'Grade 2', 'Admin'),
    ('English', 'Grade 2', 'Admin'),
    ('Arts', 'Grade 2', 'Admin'),
    ('Mathematics', 'Grade 3', 'Admin'),
    ('Science', 'Grade 3', 'Admin'),
    ('Social Studies', 'Grade 3', 'Admin'),
    ('Physical Education', 'Grade 3', 'Admin');
GO

-- =============================================
-- VIEW FOR EASY DATA ACCESS
-- =============================================

-- Create a view for active subjects
IF EXISTS (SELECT * FROM sys.views WHERE name = 'vw_ActiveSubjects')
    DROP VIEW [dbo].[vw_ActiveSubjects]
GO

CREATE VIEW [dbo].[vw_ActiveSubjects]
AS
SELECT 
    [SubjectID],
    [SubjectName],
    [GradeLevel],
    [DateAdded],
    [DateModified]
FROM [dbo].[Subjects]
WHERE [IsActive] = 1;
GO

-- =============================================
-- USEFUL QUERIES FOR TESTING
-- =============================================

-- View all subjects
-- EXEC [dbo].[sp_GetAllSubjects];

-- View subjects for a specific grade level
-- EXEC [dbo].[sp_GetSubjectsByGradeLevel] @GradeLevel = 'Grade 1';

-- Add a single subject
-- EXEC [dbo].[sp_AddSubject] @SubjectName = 'Computer Science', @GradeLevel = 'Grade 4';

-- Add multiple subjects for a grade level
-- EXEC [dbo].[sp_AddMultipleSubjects] @GradeLevel = 'Grade 5', @SubjectNames = 'Mathematics,Science,English,Social Studies,Arts';

-- Update subjects for a grade level
-- EXEC [dbo].[sp_UpdateSubjectsForGradeLevel] @GradeLevel = 'Grade 1', @SubjectNames = 'Mathematics,Science,English,Filipino,Values Education';

-- Delete all subjects for a grade level
-- EXEC [dbo].[sp_DeleteSubjectsForGradeLevel] @GradeLevel = 'Grade 1';

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if Subjects table was created
SELECT 
    TABLE_NAME,
    TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'Subjects';

-- Check table structure
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Subjects'
ORDER BY ORDINAL_POSITION;

-- Check stored procedures
SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_NAME LIKE 'sp_%' AND ROUTINE_TYPE = 'PROCEDURE'
ORDER BY ROUTINE_NAME;

PRINT 'Subjects table and stored procedures added successfully to LRIS database!';
PRINT 'You can now use the stored procedures to manage subjects.'; 