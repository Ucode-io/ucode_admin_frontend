export const permissions = [
    {
      title: "Field permissions",
      type: "field",
      image: "/img/field.jpeg",
      content: "<span>View and Edit Permissions for Table Fields:</span> <br /><br /> In a database system, granting view and edit permissions to table fields is crucial for controlling user access to data. These permissions allow users to either see the information stored in specific fields (view) or modify existing data (edit). Here's how you can implement and manage these permissions: <br /><br /> <span>1. View Permissions:</span> <br /><br /> <span>Read-Only Access</span>: Users with view permissions can execute SELECT queries to retrieve information from the specified fields in a table. They can view the data but cannot make changes to it. <br /><br /> <span>Role-Based Access Control (RBAC)</span>: Assign users to roles such as `Read-Only Users` or `Viewers.` Associate these roles with the necessary view permissions for specific fields. This ensures that users have access only to the information they need. <br /><br /> <span>Access Control Lists (ACLs)</span>: Use ACLs to explicitly define which users or roles have the right to view data in particular fields. This fine-grained control helps in restricting access based on user requirements. <br /><br /> <span>2. Edit Permissions:</span> <br /><br /> <span>Update Access</span>: Users with edit permissions can modify existing data in the specified fields. They have the capability to execute UPDATE queries to change the values stored in these fields. <br /><br /> <span>Role-Based Access Control (RBAC)</span>: Create roles like `Editors` or `Data Modifiers` and associate them with edit permissions for relevant fields. This ensures that only authorized users can make changes to the data. <br /><br /> <span>Access Control Lists (ACLs)</span>: Implement ACLs to specify which users or roles have permissions to edit data in particular fields. This allows for precise control over who can modify information."
    },
    {
      title: "Action permissions",
      type: "action",
      image: "/img/field.jpeg",
      content: "This is content"
    },
    {
      title: "Relation permission",
      type: "relation",
      image: "/img/field.jpeg",
      content: "This is content"
    },
    {
      title: "View permission",
      type: "view",
      image: "/img/field.jpeg",
      content: "This is content"
    },
    {
      title: "Custom permission",
      type: "custom",
      image: "/img/field.jpeg",
      content: "This is content"
    },
  ];