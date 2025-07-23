-- =============================================
-- DistributedResources Table Queries for LRIS
-- =============================================

-- Insert a new distributed resource record
INSERT INTO DistributedResources (SchoolID, ResourceCategory, ResourceItemID, ResourceName, Quantity, DateDistributed, Notes)
VALUES (@SchoolID, @ResourceCategory, @ResourceItemID, @ResourceName, @Quantity, @DateDistributed, @Notes);

-- Select all distributed resources
SELECT * FROM DistributedResources;

-- Select distributed resources by SchoolID
SELECT * FROM DistributedResources WHERE SchoolID = @SchoolID;

-- Update a distributed resource record
UPDATE DistributedResources
SET ResourceCategory = @ResourceCategory,
    ResourceItemID = @ResourceItemID,
    ResourceName = @ResourceName,
    Quantity = @Quantity,
    DateDistributed = @DateDistributed,
    Notes = @Notes
WHERE DistributionID = @DistributionID;

-- Delete a distributed resource record
DELETE FROM DistributedResources WHERE DistributionID = @DistributionID; 