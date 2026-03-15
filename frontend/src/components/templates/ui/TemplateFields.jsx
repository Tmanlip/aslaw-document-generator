import React from "react";

const TemplateFields = ({ fields, formData, onChange }) => {
  return (
    <>
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium">{field.label}</label>

          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              rows={4}
              required
              value={formData[field.name] || ""}
              onChange={onChange}
              className="block w-full p-2 mt-1 border rounded-md"
            />
          ) : (
            <input
              type={field.type}
              name={field.name}
              required
              value={formData[field.name] || ""}
              onChange={onChange}
              className="block w-full p-2 mt-1 border rounded-md"
            />
          )}
        </div>
      ))}
    </>
  );
};

export default TemplateFields;
