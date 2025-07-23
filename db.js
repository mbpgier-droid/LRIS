const sql = require('mssql');

const config = {
    user: 'lris_admin',
    password: 'admin123',
    server: 'DESKTOP-450275J\\SQLEXPRESS', // double backslash for escape
    database: 'LRIS',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Create a connection pool
let pool = null;

async function getConnection() {
    if (!pool) {
        pool = await sql.connect(config);
    }
    return pool;
}

async function getSchools() {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Schools');
    return result.recordset;
}

async function addSchool(school) {
    const pool = await getConnection();
    await pool.request()
        .input('name', sql.NVarChar, school.name)
        .input('id', sql.NVarChar, school.id)
        .input('enrollees', sql.Int, school.enrollees)
        .input('resourcesAllocated', sql.Int, school.resourcesAllocated)
        .input('district', sql.NVarChar, school.district)
        .input('level', sql.NVarChar, school.level)
        .input('principal', sql.NVarChar, school.principal)
        .input('contact', sql.NVarChar, school.contact)
        .input('email', sql.NVarChar, school.email)
        .query(`
            INSERT INTO Schools (Name, SchoolID, Enrollees, ResourcesAllocated, District, Level, Principal, Contact, Email)
            VALUES (@name, @id, @enrollees, @resourcesAllocated, @district, @level, @principal, @contact, @email)
        `);
}

async function updateSchool(schoolId, school) {
    const pool = await getConnection();
    await pool.request()
        .input('name', sql.NVarChar, school.name)
        .input('id', sql.NVarChar, school.id)
        .input('enrollees', sql.Int, school.enrollees)
        .input('resourcesAllocated', sql.Int, school.resourcesAllocated)
        .input('district', sql.NVarChar, school.district)
        .input('level', sql.NVarChar, school.level)
        .input('principal', sql.NVarChar, school.principal)
        .input('contact', sql.NVarChar, school.contact)
        .input('email', sql.NVarChar, school.email)
        .input('schoolId', sql.NVarChar, schoolId)
        .query(`
            UPDATE Schools 
            SET Name = @name, 
                SchoolID = @id, 
                Enrollees = @enrollees, 
                ResourcesAllocated = @resourcesAllocated, 
                District = @district, 
                Level = @level, 
                Principal = @principal, 
                Contact = @contact, 
                Email = @email
            WHERE SchoolID = @schoolId
        `);
}

async function deleteSchool(schoolId) {
    const pool = await getConnection();
    await pool.request()
        .input('schoolId', sql.NVarChar, schoolId)
        .query('DELETE FROM Schools WHERE SchoolID = @schoolId');
}


// =============================================
// ITEMS DATABASE FUNCTIONS
// =============================================

// SLM/SLAS Items Functions
async function addSLMItem(title, subject, gradeLevel, quarter, quantity, status, description, createdBy = 'Admin') {
    await sql.connect(config);
    const result = await sql.query`
        INSERT INTO SLMItems (Title, Subject, GradeLevel, Quarter, Quantity, Status, Description, CreatedBy)
        VALUES (${title}, ${subject}, ${gradeLevel}, ${quarter}, ${quantity}, ${status}, ${description}, ${createdBy});
        SELECT SCOPE_IDENTITY() AS SLMItemID;
    `;
    return result.recordset[0].SLMItemID;
}

async function getAllSLMItems() {
    await sql.connect(config);
    const result = await sql.query`
        SELECT 
            SLMItemID,
            Title,
            Subject,
            GradeLevel,
            Quarter,
            Quantity,
            Status,
            Description,
            DateAdded,
            DateModified
        FROM SLMItems
        WHERE IsActive = 1
        ORDER BY DateAdded DESC
    `;
    return result.recordset;
}

async function updateSLMItem(slmItemID, title, subject, gradeLevel, quarter, quantity, status, description, modifiedBy = 'Admin') {
    await sql.connect(config);
    await sql.query`
        UPDATE SLMItems
        SET 
            Title = ${title},
            Subject = ${subject},
            GradeLevel = ${gradeLevel},
            Quarter = ${quarter},
            Quantity = ${quantity},
            Status = ${status},
            Description = ${description},
            DateModified = GETDATE(),
            ModifiedBy = ${modifiedBy}
        WHERE SLMItemID = ${slmItemID}
    `;
}

async function deleteSLMItem(slmItemID, modifiedBy = 'Admin') {
    await sql.connect(config);
    await sql.query`
        DELETE FROM SLMItems WHERE SLMItemID = ${slmItemID}
    `;
}

// Equipment Items Functions
async function addEquipmentItem(equipmentName, equipmentType, quantity, status, description, createdBy = 'Admin') {
    await sql.connect(config);
    const result = await sql.query`
        INSERT INTO EquipmentItems (EquipmentName, EquipmentType, Quantity, Status, Description, CreatedBy)
        VALUES (${equipmentName}, ${equipmentType}, ${quantity}, ${status}, ${description}, ${createdBy});
        SELECT SCOPE_IDENTITY() AS EquipmentID;
    `;
    return result.recordset[0].EquipmentID;
}

async function getAllEquipmentItems() {
    await sql.connect(config);
    const result = await sql.query`
        SELECT 
            EquipmentID,
            EquipmentName,
            EquipmentType,
            Quantity,
            Status,
            Description,
            DateAdded,
            DateModified
        FROM EquipmentItems
        WHERE IsActive = 1
        ORDER BY DateAdded DESC
    `;
    return result.recordset;
}

async function updateEquipmentItem(equipmentID, equipmentName, equipmentType, quantity, status, description, modifiedBy = 'Admin') {
    await sql.connect(config);
    await sql.query`
        UPDATE EquipmentItems
        SET 
            EquipmentName = ${equipmentName},
            EquipmentType = ${equipmentType},
            Quantity = ${quantity},
            Status = ${status},
            Description = ${description},
            DateModified = GETDATE(),
            ModifiedBy = ${modifiedBy}
        WHERE EquipmentID = ${equipmentID}
    `;
}

async function deleteEquipmentItem(equipmentID, modifiedBy = 'Admin') {
    await sql.connect(config);
    await sql.query`
        UPDATE EquipmentItems
        SET IsActive = 0, DateModified = GETDATE(), ModifiedBy = ${modifiedBy}
        WHERE EquipmentID = ${equipmentID}
    `;
}

// TVL Items Functions
async function addTVLItem(itemName, track, strand, gradeLevel, quantity, status, description, createdBy = 'Admin') {
    await sql.connect(config);
    const result = await sql.query`
        INSERT INTO TVLItems (ItemName, Track, Strand, GradeLevel, Quantity, Status, Description, CreatedBy)
        VALUES (${itemName}, ${track}, ${strand}, ${gradeLevel}, ${quantity}, ${status}, ${description}, ${createdBy});
        SELECT SCOPE_IDENTITY() AS TVLItemID;
    `;
    return result.recordset[0].TVLItemID;
}

async function getAllTVLItems() {
    await sql.connect(config);
    const result = await sql.query`
        SELECT 
            TVLItemID,
            ItemName,
            Track,
            Strand,
            GradeLevel,
            Quantity,
            Status,
            Description,
            DateAdded,
            DateModified
        FROM TVLItems
        WHERE IsActive = 1
        ORDER BY DateAdded DESC
    `;
    return result.recordset;
}

async function updateTVLItem(tvlItemID, itemName, track, strand, gradeLevel, quantity, status, description, modifiedBy = 'Admin') {
    await sql.connect(config);
    await sql.query`
        UPDATE TVLItems
        SET 
            ItemName = ${itemName},
            Track = ${track},
            Strand = ${strand},
            GradeLevel = ${gradeLevel},
            Quantity = ${quantity},
            Status = ${status},
            Description = ${description},
            DateModified = GETDATE(),
            ModifiedBy = ${modifiedBy}
        WHERE TVLItemID = ${tvlItemID}
    `;
}

async function deleteTVLItem(tvlItemID, modifiedBy = 'Admin') {
    await sql.connect(config);
    await sql.query`
        UPDATE TVLItems
        SET IsActive = 0, DateModified = GETDATE(), ModifiedBy = ${modifiedBy}
        WHERE TVLItemID = ${tvlItemID}
    `;
}

// Lesson Exemplar Items Functions
async function addLessonExemplarItem(lessonTitle, subject, gradeLevel, quarter, week, status, description, createdBy = 'Admin') {
    await sql.connect(config);
    const result = await sql.query`
        INSERT INTO LessonExemplarItems (LessonTitle, Subject, GradeLevel, Quarter, Week, Status, Description, CreatedBy)
        VALUES (${lessonTitle}, ${subject}, ${gradeLevel}, ${quarter}, ${week}, ${status}, ${description}, ${createdBy});
        SELECT SCOPE_IDENTITY() AS LessonID;
    `;
    return result.recordset[0].LessonID;
}

async function getAllLessonExemplarItems() {
    await sql.connect(config);
    const result = await sql.query`
        SELECT 
            LessonID,
            LessonTitle,
            Subject,
            GradeLevel,
            Quarter,
            Week,
            Status,
            Description,
            DateAdded,
            DateModified
        FROM LessonExemplarItems
        WHERE IsActive = 1
        ORDER BY DateAdded DESC
    `;
    return result.recordset;
}

async function updateLessonExemplarItem(lessonID, lessonTitle, subject, gradeLevel, quarter, week, status, description, modifiedBy = 'Admin') {
    await sql.connect(config);
    await sql.query`
        UPDATE LessonExemplarItems
        SET 
            LessonTitle = ${lessonTitle},
            Subject = ${subject},
            GradeLevel = ${gradeLevel},
            Quarter = ${quarter},
            Week = ${week},
            Status = ${status},
            Description = ${description},
            DateModified = GETDATE(),
            ModifiedBy = ${modifiedBy}
        WHERE LessonID = ${lessonID}
    `;
}

async function deleteLessonExemplarItem(lessonID, modifiedBy = 'Admin') {
    await sql.connect(config);
    await sql.query`
        UPDATE LessonExemplarItems
        SET IsActive = 0, DateModified = GETDATE(), ModifiedBy = ${modifiedBy}
        WHERE LessonID = ${lessonID}
    `;
}


// =============================================
// DISTRIBUTED RESOURCES DATABASE FUNCTIONS
// =============================================

// Insert a new distributed resource record
async function addDistributedResource({ SchoolID, ResourceCategory, ResourceItemID, ResourceName, Quantity, DateDistributed, Notes }) {
    console.log('DB insert:', { SchoolID, ResourceCategory, ResourceItemID, ResourceName, Quantity, DateDistributed, Notes });
    const pool = await getConnection();
    await pool.request()
        .input('SchoolID', sql.NVarChar, SchoolID)
        .input('ResourceCategory', sql.NVarChar, ResourceCategory)
        .input('ResourceItemID', sql.Int, ResourceItemID)
        .input('ResourceName', sql.NVarChar, ResourceName)
        .input('Quantity', sql.Int, Quantity)
        .input('DateDistributed', sql.DateTime, DateDistributed || new Date())
        .input('Notes', sql.NVarChar, Notes)
        .query(`
            INSERT INTO DistributedResources (SchoolID, ResourceCategory, ResourceItemID, ResourceName, Quantity, DateDistributed, Notes)
            VALUES (@SchoolID, @ResourceCategory, @ResourceItemID, @ResourceName, @Quantity, @DateDistributed, @Notes)
        `);
}

// Fetch all distributed resources
async function getAllDistributedResources() {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM DistributedResources');
    return result.recordset;
}

// Fetch distributed resources by SchoolID
async function getDistributedResourcesBySchoolID(SchoolID) {
    const pool = await getConnection();
    const result = await pool.request()
        .input('SchoolID', sql.NVarChar, SchoolID)
        .query('SELECT * FROM DistributedResources WHERE SchoolID = @SchoolID');
    return result.recordset;
}


async function testConnection() {
    try {
        const pool = await getConnection();
        console.log('DB connection successful!');
    } catch (err) {
        console.error('DB connection failed:', err);
    }
}
testConnection();

async function loadDistributedSchools() {
    const res = await fetch('/api/distributed-resources');
    const data = await res.json();
    // Get unique schools
    const schoolsMap = {};
    data.forEach(r => {
        if (!schoolsMap[r.SchoolID]) {
            schoolsMap[r.SchoolID] = r;
        }
    });
    const schools = Object.values(schoolsMap);
    displaySchoolsGrid(schools);
}

function displaySchoolsGrid(schools) {
    const container = document.getElementById('distributedSchoolsGrid');
    container.innerHTML = '';
    schools.forEach(school => {
        const card = document.createElement('div');
        card.className = 'school-card';
        card.innerHTML = `<strong>${school.SchoolID}</strong><br>${school.ResourceName || school.ResourceCategory}`;
        card.onclick = () => showSchoolDistributedResources(school.SchoolID);
        container.appendChild(card);
    });
}

async function showSchoolDistributedResources(schoolId) {
    const res = await fetch(`/api/distributed-resources/by-school/${schoolId}`);
    const data = await res.json();
    const container = document.getElementById('schoolDistributedResources');
    if (data.length === 0) {
        container.innerHTML = '<p>No distributed resources for this school.</p>';
        return;
    }
    let html = `<h3>Distributed Resources for School ID: ${schoolId}</h3><table><tr>
        <th>Category</th><th>Item ID</th><th>Resource Name</th><th>Quantity</th><th>Date</th><th>Notes</th></tr>`;
    data.forEach(r => {
        html += `<tr>
            <td>${r.ResourceCategory}</td>
            <td>${r.ResourceItemID || ''}</td>
            <td>${r.ResourceName || ''}</td>
            <td>${r.Quantity}</td>
            <td>${new Date(r.DateDistributed).toLocaleDateString()}</td>
            <td>${r.Notes || ''}</td>
        </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
}

module.exports = {
    getSchools,
    addSchool,
    updateSchool,
    deleteSchool,
    // Items functions
    addSLMItem,
    getAllSLMItems,
    updateSLMItem,
    deleteSLMItem,
    addEquipmentItem,
    getAllEquipmentItems,
    updateEquipmentItem,
    deleteEquipmentItem,
    addTVLItem,
    getAllTVLItems,
    updateTVLItem,
    deleteTVLItem,
    addLessonExemplarItem,
    getAllLessonExemplarItems,
    updateLessonExemplarItem,
    deleteLessonExemplarItem,
    // Distributed Resources functions
    addDistributedResource,
    getAllDistributedResources,
    getDistributedResourcesBySchoolID,
    loadDistributedSchools,
    displaySchoolsGrid,
    showSchoolDistributedResources
}; 