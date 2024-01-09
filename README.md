
# Credential Manager

This app links to a MongoDB Database hosted on Atlas. This database is used to store the credentials linked to different accounts within an organisation's divisions.


## Usage/Examples

Install the necessary dependencies by running **'npm install'** in the root, the frontend folder, and the backend folder.

To start the app, run **'npm start'** in the root folder. A browser window will automatically open.

The user can either register and add their account to the DB, or login with an existing account. The user's assigned role will determine their access level, and newly registered users are assigned the 'Standard' role by default.

Once a user has been assigned a division, they can view the credentials linked to it and add more to the database. A 'Management' user can do everything that a 'Standard' user can do, as well as update the entries if needed.

An 'Admin' user is capable of all of the above, and has access to the 'User Management' page, where they can change the role and division of any registered user.

The 'Credential Repository' page displays the credentials linked to the current user's assigned division, and allows them to add / update entries (depending on their role). Any credentials added by the user will be linked to their assigned division.

The 'User Management' page is only accessible to Admin users, and the link to it will not even be visible to non-admin users.