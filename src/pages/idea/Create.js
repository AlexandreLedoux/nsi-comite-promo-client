import React, { useState } from 'react';
import SimpleForm from '../../components/module/SimpleForm';
import { useNavigate } from 'react-router-dom';
import FormCover from '../../components/pages/FormCover';
import ideaAPI from '../../services/ideaAPI';
import NavButton from '../../components/module/NavButton';

const Create = () => {
  const navigate = useNavigate();
  const [error, setError] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(false);

    ideaAPI.create(formData)
      /**
        INSERT INTO idea 
          (user_id, text, created_at)
        VALUES 
          (1, 'Bonjour tout le monde', "2023-11-10 18:09:41");
      */
      .then(response => {
        navigate('/', { replace: false });
      })
      .catch(error => {
        console.log(error);
        if (error.response.status == 422) {
          for (const violation of error.response.data.violations) {
            setError(previousErrors => ({
              ...previousErrors,
              [violation.propertyPath]: violation.message
            }));
          }
        }
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const forms = [
    {
      name: "text",
      label: "Texte",
      value: formData.text,
      onChange: handleChange,
      placeholder: "Texte",
      type: 'textarea',
      error: error.text,
    }
  ]

  const links = [
    {
      text: 'Se déconnecter',
      url: '/logout',
      btnLink: true,
      icon: 'user-slash',
    }
  ];

  return (
    <div>

      <NavButton links={links} backLink />

      <FormCover
        content={<SimpleForm forms={forms} onSubmit={handleSubmit} isSubmitted={isSubmitted} button='Publier mon idée' btnColor='noir' />}
        title='Nouvelle idée'
      />

    </div>
  );
};

export default Create;
