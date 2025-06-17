📄 Overview

Imagle is a full-stack web application built for managing internal image
access in a secure and efficient manner. Users can search for images by
tags, request access, and download approved images. Admins can manage
uploads, handle requests, and oversee analytics.

![](media/image1.jpeg){width="5.71159886264217in"
height="5.409091207349081in"}

Project Structure

**🔑 Features**

- **User:**

<!-- -->

- Sign Up & Login (with OTP verification)

- Persistent Login via JWT

- Search images by tags

- Add to Cart

- Send request for download

- View approved images

- One-time zip download

- History tracking

- Dark mode toggle

- Profile dropdown with logout

<!-- -->

- **Admin:**

<!-- -->

- Login with protected credentials

- Role-based access with JWT

- Dashboard access via dropdown

- Upload images with tags

- View/edit uploaded images

- Filter and approve/reject user requests

- Insights with charts, Excel export, and admin creation

- Back to user panel from admin panel

<!-- -->

- **Tech Stack:**

<!-- -->

- **Frontend:** ReactJS, Bootstrap, Framer Motion

- **Backend:** Node.js, Express.js

- **Database:** MongoDB

- **Authentication:** JSON Web Token (JWT)

- **Storage:** Local folder (images), ZIP compression

- **Others:** React Router, Axios, Chart.js

<!-- -->

- **Authentication (JWT)**

<!-- -->

- JSON Web Token (JWT) is used for secure login.

- Stores {username, role} in the token payload.

- Auth tokens persist in local Storage to avoid re-login until user
  manually logs out.

<!-- -->

- **Admin Credentials Handling**

<!-- -->

- Admin credentials are stored securely in **MongoDB** via Admin model.

- New admins can only be created by other logged-in admins through the
  **Insights** section.

- Passwords are hashed before saving.

<!-- -->

- Flowchart:

User Authentication -

![](media/image2.png){width="3.640332458442695in"
height="3.020485564304462in"}

Data Flow --

![](media/image3.png){width="7.364822834645669in"
height="3.075757874015748in"}

**🎯Usefulness of Imagle**

**Imagle** is not just an image viewer---it\'s a complete image request
and approval management solution. Here's why it's useful:

**✅ 1. Controlled Access to Digital Assets**

Admins can approve or reject image requests, ensuring only authorized
users can download specific resources. This prevents unauthorized usage
of sensitive or premium media.

**🔐 2. Role-Based Access with Security**

Built with **JWT authentication**, it ensures that users and admins have
distinct, secure access, reducing data exposure risks.

**📦 3. Efficient Request Management**

Users can request multiple images at once and receive them bundled as a
ZIP, making the experience smooth and reducing admin workload.

**🕵️‍♂️ 4. Complete Activity Tracking**

Admins get insights into:

- Daily image requests

- Top used tags

- User activities

- Admin login logs

This enhances decision-making and internal monitoring.

**🖼️ 5. Easy Image Search & Tagging**

The tag-based image search saves time and improves discoverability of
assets---essential for teams managing hundreds of files.

**🧑‍💼 6. Seamless Admin Tools**

Admins can:

- Upload images with tags

- Edit tags dynamically

- View pending requests

- Add new admin accounts  
  All within a visually intuitive dashboard.

**🎨 7. Beautiful, Responsive UI**

With **Framer Motion animations**, responsive design, and dark mode,
it's both professional and pleasant to use on any device.

- **Real-World Use: Who Can Use Imagle?**

**Imagle** is designed to serve a wide range of organizations and
industries that require structured, secure, and trackable access to
digital image assets.

<table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>🏢 1. Corporate Teams</strong></p>
<ul>
<li><p><strong>Marketing departments</strong> sharing campaign
graphics.</p></li>
<li><p><strong>HR teams</strong> distributing branded templates and
assets.</p></li>
<li><p><strong>Design teams</strong> handling internal image
approvals.</p></li>
</ul></th>
<th><p><strong>📸 2. Photography &amp; Media Studios</strong></p>
<ul>
<li><p>Manage client requests for specific photoshoots.</p></li>
<li><p>Share images with watermark protection and download
approval.</p></li>
<li><p>Track which clients received which assets and when.</p></li>
</ul></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p><strong>🏫 3. Educational Institutions</strong></p>
<ul>
<li><p>Teachers sharing lecture visuals or study material.</p></li>
<li><p>Media labs storing large sets of educational images.</p></li>
<li><p>Admin-controlled access ensures content integrity.</p></li>
</ul></td>
<td><p><strong>🎨 4. Design &amp; Creative Agencies</strong></p>
<ul>
<li><p>Share design drafts, illustrations, UI assets with
clients.</p></li>
<li><p>Enable secure image review and approval process.</p></li>
<li><p>Maintain organized logs of approved/rejected content.</p></li>
</ul></td>
</tr>
<tr class="even">
<td><p><strong>🏛️ 5. Government &amp; Legal Sectors</strong></p>
<ul>
<li><p>Manage secure access to evidence/media files.</p></li>
<li><p>Enable role-based access with approval tracking.</p></li>
<li><p>Maintain compliance with document control standards.</p></li>
</ul></td>
<td><p><strong>6. E-Commerce &amp; Product Teams</strong></p>
<ul>
<li><p>Centralized management of product images.</p></li>
<li><p>Selective download access to sales/marketing teams.</p></li>
<li><p>Approvals reduce risk of using outdated or unapproved
content.</p></li>
</ul></td>
</tr>
</tbody>
</table>
