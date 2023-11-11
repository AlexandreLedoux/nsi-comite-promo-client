import React, { useEffect, useState } from 'react';
import userAPI from '../../../services/userAPI';
import NavButton from '../../../components/module/NavButton';

function Index() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        userAPI.findAll()
            .then(response => {
                setUsers(response.data['hydra:member']);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const links = [
        {
            text: 'Accueil',
            url: '/',
            btnLink: true,
            icon: 'home',
        },
        {
            text: 'Se déconnecter',
            url: '/logout',
            btnLink: true,
            icon: 'user-slash',
        }
    ];

    const deleteUser = (user) => {
        userAPI.deleteUser(user.id)
          .then((response) => {
            const idees = users.filter((item) => item.id !== user.id);
            setUsers(idees);
          })
          .catch((error) => {
            console.log(error);
          });
      }

    return (
        <div>

            <NavButton links={links} />
            <div className='container'>
                {users.map((user, index) => (
                    <div key={index} className={'row p-10' + (index%2 == 0 ? ' bg-light br-6' : '')}>
                        <div className='col'>
                            {user.email}
                        </div>
                        <div className='col'>
                            <button onClick={() => deleteUser(user)} className='btn-link text-blue'><i className="fa-regular fa-trash"></i></button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Index;
