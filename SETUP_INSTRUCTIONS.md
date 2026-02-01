# Setup Instructions - Tinker Bell's Garden

## Database Setup

### Step 1: Create/Update Database Schema

1. Run the initial schema (if not already done):
   ```sql
   -- Run backend-db/schema.sql in phpMyAdmin or MySQL CLI
   ```

2. Run the update schema to add new tables:
   ```sql
   -- Run backend-db/schema_update.sql in phpMyAdmin or MySQL CLI
   ```

   **Important**: The schema_update.sql uses `tinkerbell_garden` as the database name. If your database has a different name, update the `USE` statement in the file.

### Step 2: Verify Database Configuration

Make sure `config/db.php` has the correct database name:
```php
$dbname = "tinkerbell_garden"; // Should match your actual database name
```

### Step 3: Create Upload Directories

Create the following directories for file uploads (if they don't exist):
- `uploads/news/images/`
- `uploads/news/pdfs/`
- `uploads/products/images/`
- `uploads/products/pdfs/`

Make sure these directories are writable by the web server.

## Features Implemented

### ✅ 3.1 - User Tracking
- News and Products tables include `created_by` and `updated_by` fields
- These fields track which user created/modified each item
- Admin dashboard shows creator and updater information

### ✅ 3.2 - Text, Photo, and PDF Support
- News items can have:
  - Title (text)
  - Content (text)
  - Image (jpg, jpeg, png, gif, webp)
  - PDF file
  
- Products can have:
  - Name (text)
  - Description (text)
  - Price (decimal)
  - Image (jpg, jpeg, png, gif, webp)
  - PDF file

### ✅ 3.3 - Contact Form Database Storage
- Contact form submissions are saved to `contact_submissions` table
- Admin can view all submissions in the Dashboard
- Admin can mark submissions as read/unread

## API Endpoints

### Contact
- `POST /api/contact/submit.php` - Submit contact form

### Admin
- `GET /api/admin/get_contact_submissions.php` - Get all contact submissions
- `POST /api/admin/mark_contact_read.php` - Mark submission as read/unread

### News
- `POST /api/news/create.php` - Create news (requires login)
- `GET /api/news/get_all.php` - Get all news
- `POST /api/news/update.php` - Update news (requires login)

### Products
- `POST /api/products/create.php` - Create product (requires login)
- `GET /api/products/get_all.php` - Get all products
- `POST /api/products/update.php` - Update product (requires login)

## Admin Dashboard

Access the admin dashboard at `/admin/` (requires admin login).

The dashboard includes:
- **Users** - Manage users
- **Contact Messages** - View and manage contact form submissions
- **News** - View news items with creator/updater information
- **Products** - View products with creator/updater information

## Notes

- File uploads are stored in the `uploads/` directory
- Images are validated (jpg, jpeg, png, gif, webp only)
- PDFs are validated (pdf only)
- Old files are deleted when updating with new files
- All database operations use prepared statements for security
