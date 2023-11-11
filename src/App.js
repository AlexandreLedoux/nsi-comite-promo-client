import ideaAPI from './services/ideaAPI';
import likeIdeaAPI from './services/likeIdeaAPI';
import './App.css';
import React, { useEffect, useState } from 'react';
import authAPI from './services/authAPI';
import voteAPI from './services/voteAPI';
import ideaCommentAPI from './services/ideaCommentAPI';
import NavButton from './components/module/NavButton';
import Pusher from 'pusher-js';
import axios from 'axios';
import ScrollReveal from 'scrollreveal';

function App() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    getIdeas();
    /**
      SELECT
        i.id,                          => id de l'idée
        i.text as idea_text,           => texte de l'idée
        i.created_at,                  => date de creation de l'idée
        u.email as user_email,         => email du user qui a publier l'idée
        ic.text as comment_text,       => texte de chaque commentaire
        uc.email as comment_user_email => email du user de chaque commentaire
      FROM
        idea i
      JOIN
        user u ON i.user_id = u.id
      LEFT JOIN
        idea_comment ic ON i.id = ic.idea_id
      JOIN
        user uc ON ic.user_id = uc.id
      ORDER BY
        i.id DESC, ic.id ASC;
    */
  }, []);

  useEffect(() => {
    for (let i = 0; i < 50; i++) {
      const selector = `.reveal-${i}`;
      ScrollReveal().reveal(selector, { delay: 100 * i });
    }
  }, [ideas]);

  useEffect(() => {
    var pusher = new Pusher('2831d48a7b191b1cd8c0', {
      cluster: 'eu',
    });
    var channel = pusher.subscribe('my-channel');
    channel.bind('new-idea', function (data) {
      addIdea(data);
    });
    channel.bind('new-ideaComment', function (data) {
      addCommentToIdea(data.idea.id, data)
    });
    channel.bind('delete-ideaComment', function (data) {
      deleteCommentIdeaInIdea(data.ideaId, data.id);
    });
    channel.bind('delete-idea', function (data) {
      deleteIdeaFromIdeas(data.id);
    });
  }, []);

  const deleteCommentIdeaInIdea = (ideaId, commentId) => {
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) => {
        if (idea.id === ideaId) {
          // Supprimer le commentaire si comment.id est commentId
          idea.ideaComments = idea.ideaComments.filter((comment) => comment.id !== commentId);
        }
        return idea;
      })
    );
  };

  const deleteIdeaFromIdeas = (ideaId) => {
    setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== ideaId));
  };

  const getIdeas = () => {
    ideaAPI.findAll()
      .then(response => {
        const ideasData = response.data['hydra:member'];

        // Ajouter la propriété newComment à chaque idée
        const ideasWithNewComment = ideasData.map(idea => ({
          ...idea,
          commentText: '',
          showComments: false,
          searchGif: '',
          showGif: false,
          allGif: []
        }));

        setIdeas(ideasWithNewComment);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const changeLike = (idea) => {
    setIdeas((prevIdeas) =>
      prevIdeas.map((item) => {
        if (item.id === idea.id) {
          item.isLikedByUser = !item.isLikedByUser
          if (item.isLikedByUser == true) {
            item.countLike = item.countLike + 1
          } else {
            item.countLike = item.countLike - 1
          }
        }
        return item;
      })
    );

    const data = {
      idea: '/api/ideas/' + idea.id,
      user: '/api/users/' + authAPI.getUser().id
    };

    likeIdeaAPI.create(data)
      .then(response => {
        /**
          On créer un nouveau like :

          INSERT INTO like_idea 
            (idea_id, user_id, created_at)
          VALUES 
            (68, 1, "2023-11-10 18:09:41");

            
          Si le like existe déjà, on le supprime :

          DELETE FROM 'like_idea'
          WHERE 'id' = 1
        */
      })
      .catch(error => {
        console.log(error);
      });
  };

  const vote = (idea, choice) => {
    if (!idea.isVotedByUser && idea.votable[0]) {
      const updatedIdeas = ideas.map(item => {
        if (item.id === idea.id) {
          item.voteBattle[choice ? 0 : 1] += 1;
          item.voteBattle[2] += 1
          item.voted = true;
        }
        return item;
      });

      setIdeas(updatedIdeas);
      const data = {
        idea: '/api/ideas/' + idea.id,
        choice: choice
      }

      voteAPI.create(data)
        /**
          INSERT INTO vote 
            (idea_id, user_id, choice, created_at)
          VALUES 
            (10, 1, true, "2023-11-10 18:09:41");
        */
        .then(response => {
          setIdeas((prevIdeas) =>
            prevIdeas.map((item) => {
              if (item.id === idea.id) {
                item.isVotedByUser = !item.isVotedByUser
              }
              return item;
            })
          );
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const formatDate = (inputDate) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: 'numeric' };
    const formattedDate = new Date(inputDate).toLocaleDateString('fr-FR', options);
    return formattedDate + '.';
  };

  const handleSubmit = (event, idea) => {
    event.preventDefault();
    publishComment(idea.id, idea.commentText);
  };

  const handleChangeComment = (e, idea) => {
    const text = e.target.value;
    setIdeas((prevIdeas) =>
      prevIdeas.map((item) => {
        if (item.id === idea.id) {
          item.commentText = text;
        }
        return item;
      })
    );
  };

  const addCommentToIdea = (ideaId, comment) => {
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) => {
        if (idea.id === ideaId) {
          idea.ideaComments.push(comment);
        }
        return idea;
      })
    );
  };

  const changeShowComments = (idea) => {
    setIdeas((prevIdeas) =>
      prevIdeas.map((item) => {
        if (item.id === idea.id) {
          item.showComments = !item.showComments
        }
        return item;
      })
    );
  };

  const deleteIdea = (idea) => {
    ideaAPI.deleteIdea(idea.id)
      /**
        DELETE FROM idea
        WHERE 'id' = 1
      */
      .then((response) => {
        const idees = ideas.filter((item) => item.id !== idea.id);
        setIdeas(idees);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const deleteComment = (idea, ideaComment) => {
    ideaCommentAPI.deleteIdeaComment(ideaComment.id)
      /**
        DELETE FROM idea_comment
        WHERE 'id' = 1
      */
      .then(response => {
        setIdeas(prevIdeas => prevIdeas.map(item => {
          if (item.id === idea.id) {
            item.ideaComments = item.ideaComments.filter(comment => comment.id !== ideaComment.id);
          }
          return item;
        }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const links = [
    {
      text: authAPI.getUser().firstName,
      url: '/settings',
      btnLink: true,
      icon: 'user',
    },
    {
      text: 'Nouvelle idée',
      url: '/idea/new',
      btnLink: true,
      icon: 'thought-bubble',
    },
    {
      text: 'Se déconnecter',
      url: '/logout',
      btnLink: true,
      icon: 'user-slash',
    }
  ];

  if (authAPI.hasRole("ROLE_ADMIN")) {
    links.push({
      text: 'Admin',
      url: '/admin/user',
      btnLink: true,
      icon: 'users',
    });
  }

  const addIdea = (newIdea) => {
    setIdeas((prevIdeas) => [newIdea, ...prevIdeas]);
  };

  const findGifOnTenor = (data) => {
    return axios
      .get('https://g.tenor.com/v1/search?q=' + data + '&key=LIVDSRZULELA&limit=3', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(response => {
        return response;
      });
  };

  const handleChangeSearchGif = (e, idea) => {
    const text = e.target.value;
    setIdeas((prevIdeas) =>
      prevIdeas.map((item) => {
        if (item.id === idea.id) {
          item.searchGif = text;
        }
        return item;
      })
    );

    findGifOnTenor(text)
      .then(response => {
        setIdeas((prevIdeas) =>
          prevIdeas.map((item) => {
            if (item.id === idea.id) {
              item.allGif = [];
              response.data.results.forEach(result => {
                item.allGif.push(result.media[0].gif.url);
              });
            }
            return item;
          })
        );
      })
      .catch(error => {
        console.log(error);
      });
  };

  const simpleDate = (date) => {
    const dateObj = new Date(date);
    const jour = dateObj.getDate().toString().padStart(2, '0');
    const mois = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const annee = dateObj.getFullYear();
    const dateTransformee = `${jour}/${mois}/${annee}`;
    return dateTransformee;
  };

  const publishComment = (ideaId, text) => {
    const data = {
      idea: '/api/ideas/' + ideaId,
      text: text,
    };

    ideaCommentAPI.create(data)
      /**
        INSERT INTO idea_comment
          (idea_id, user_id, text, created_at)
        VALUES 
          (10, 1, 'Bonne idée.', "2023-11-10 18:09:41");
      */
      .then((response) => {
        setIdeas((prevIdeas) =>
          prevIdeas.map((item) => {
            if (item.id === ideaId) {
              item.searchGif = '';
              item.allGif = [];
              item.commentText = '';
            }
            return item;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>

      <NavButton links={links} />
      <div className='container'>
        <div className='message'>
          <h1>
            Bienvenue {authAPI.getUser().firstName},
          </h1>
          <span>voici la liste des idées pour le comité de vie lycéenne.</span>
        </div>
        {ideas.map((idea, index) => (
          <div key={index} className={'idea-card mb-20 reveal-' + index}>
            <div className='idea-card-body'>
              <p className='my-0'><i className="fa-solid fa-quote-left mr-10"></i>{idea.text}</p>
              <p className='idea-card-author mb-10'>{idea.user.firstNameInitial}. {idea.user.lastName}, {simpleDate(idea.createdAt)}</p>
            </div>
            {idea.votable[0] && (
              <>
                <div className={'idea-card-vote' + (!idea.votable[0] ? ' voted' : idea.isVotedByUser ? ' voted' : '')}>
                  <div
                    onClick={() => vote(idea, true)}
                    className='idea-card-vote-block idea-card-vote-block-left'
                    style={{ flex: idea.voteBattle[2] === 0 ? 1 : idea.voteBattle[0] }}
                  >
                    Pour - ({idea.voteBattle[0]})
                  </div>
                  <div
                    onClick={() => vote(idea, false)}
                    className='idea-card-vote-block idea-card-vote-block-right'
                    style={{ flex: idea.voteBattle[2] === 0 ? 1 : idea.voteBattle[1] }}
                  >
                    Contre - ({idea.voteBattle[1]})
                  </div>
                </div>
                <div className='vote-info'>
                  {idea.votable[1]}
                </div>
              </>
            )}
            {idea.votable[2].finished[0] && (
              <>
                <div className='idea-card-vote voted'>
                  <div
                    className='idea-card-vote-block idea-card-vote-block-left'
                    style={{ flex: idea.voteBattle[2] === 0 ? 1 : idea.voteBattle[0] }}
                  >
                    Pour - ({idea.voteBattle[0]})
                  </div>
                  <div
                    className='idea-card-vote-block idea-card-vote-block-right'
                    style={{ flex: idea.voteBattle[2] === 0 ? 1 : idea.voteBattle[1] }}
                  >
                    Contre - ({idea.voteBattle[1]})
                  </div>
                </div>
                <div className='vote-info'>
                  {idea.votable[1]}
                </div>
              </>
            )}
            <div className={'idea-card-footer'}>
              <button
                onClick={() => changeLike(idea)}
                className='idea-btn text-rouge hover-bg-rouge'>
                <i className={'fa-' + (idea.isLikedByUser ? 'solid' : 'regular') + ' fa-heart'}></i> {idea.countLike}
              </button>
              <button
                onClick={() => changeShowComments(idea)}
                className='idea-btn text-noir hover-bg-noir'>
                <i className={'fa-' + (idea.showComments ? 'solid' : 'regular') + ' fa-comment'}></i> {idea.ideaComments.length}
              </button>
              {idea.user.id == authAPI.getUser().id || authAPI.hasRole('ROLE_DELETE_IDEA') || authAPI.hasRole('ROLE_SUPER_ADMIN') ? (
                <button
                  onClick={() => deleteIdea(idea)}
                  className='idea-btn text-noir hover-bg-noir'>
                  <i className='fa-regular fa-trash'></i>
                </button>
              ) : (
                <button
                  className='idea-btn idea-btn-disabled'>
                  <i className='fa-regular fa-trash-slash'></i>
                </button>
              )}
            </div>

            {idea.showComments && (
              <div>
                <form onSubmit={(event) => handleSubmit(event, idea)} className='row mt-10'>
                  <input
                    name={idea.is}
                    value={idea.commentText}
                    onChange={(event) => {
                      handleChangeComment(event, idea);
                      handleChangeSearchGif(event, idea);
                    }}
                    type='text'
                    className='form-control'
                    required={true}
                    placeholder='Votre commentaire...'
                  />
                  <button type="submit" className='btn btn-noir'>Commenter</button>
                </form>
                <div className='card'>
                  {idea.commentText != '' && (
                    <div className='row mt-20'>
                      {idea.allGif.map((element, index) => (
                        <div key={index} className='col' onClick={() => publishComment(idea.id, element)}>
                          <img src={element} className='ideaComment-gif-result' />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {idea.ideaComments.length !== 0 && (
                  <div className='mt-10'>
                    {idea.ideaComments.map((comment, index) => (
                      <div key={index} className={'mt-6'}>

                        <div className='ideaComment-author'>
                          {comment.user.id == authAPI.getUser().id || authAPI.hasRole('ROLE_DELETE_IDEA') || authAPI.hasRole('ROLE_SUPER_ADMIN') ? (
                            <button onClick={() => deleteComment(idea, comment)} className='btn-link mr-10 text-pink'>
                              <i className='fa-regular fa-trash'></i>
                            </button>
                          ) : ''}
                          {comment.user.firstNameInitial}. {comment.user.lastName}
                        </div>
                        {comment.gif ? (
                          <img src={comment.text} className='ideaComment-gif' />
                        ) : comment.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
