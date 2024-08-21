import { AirComponent, html, airCss, keyframes, createState, globalState, createQuery, onUnMount, Router, onMount} from '../air-js/core/air.js';

const globalStyles = airCss({
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  });

  const bodyStyles = airCss({
    fontFamily: "'Arial', sans-serif",
    minHeight: '100vh',
    display: 'flex',
  });

  const sidebarStyles = airCss({
    width: '250px',
    background: 'linear-gradient(291deg, #3498db87, #8e44ad94)',
    backdropFilter: 'blur(10px)',
    padding: '20px',
    borderRight: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  });

  const sidebarTitleStyles = airCss({
    marginBottom: '30px',
    fontSize: '24px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  });

  const categoryListStyles = airCss({
    listStyleType: 'none',
    width: '100%',
  });

  const categoryItemStyles = airCss({
    marginBottom: '15px',
    position: 'relative',
    transition: 'all 0.3s ease',
  });

  const categoryBtnStyles = airCss({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.26)',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    position: 'relative',
    _hover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      _before: {
        transform: "scaleX(1)",
        transformOrigin: "left",
      },
    },
    _before: {
      content: "",
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))',
      zIndex: -1,
      transform: 'scaleX(0)',
      transformOrigin: 'left',
      transition: 'transform 0.3s ease',
    },
  });

  const categoryIconStyles = airCss({
    marginRight: '10px',
    width: "1em",
    height: "1em",
    borderRadius: "50%",

  });

  const mainContentStyles = airCss({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  });

  const headerStyles = airCss({
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  });

  const headerTitleStyles = airCss({
    "font-size": "72px",
    background: "linear-gradient(291deg, #3498db87, #8e44ad94)",
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
  });

  const addNoteBtnStyles = airCss({
    background: 'linear-gradient(291deg, #3498db87, #8e44ad94)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'background 0.3s, transform 0.3s, box-shadow 0.3s',
    _hover: {
      background: 'linear-gradient(250deg, #3498db87, #8e44ad94)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    },
  });

  const notesGridStyles = airCss({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    padding: '20px',
    overflowY: 'auto',
  });

  const noteCardStyles = airCss({
    background: 'rgb(183 209 255 / 64%)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '20px',
    transition: 'transform 0.3s',
    _hover: {
      transform: 'translateY(-5px)',
    },
  });

  const noteCardTitleStyles = airCss({
    marginBottom: '10px',
  });

  const noteCardContentStyles = airCss({
    fontSize: '0.9em',
    overflowWrap: "break-word",
    _after: {
        content:"..."
    }
  });

  const colorPickerStyles = airCss({
    position: 'absolute',
    top: '100%',
    left: '0',
    zIndex: '1000',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  });

  const buttonStyles = airCss({
    padding: '5px 10px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    fontWeight: 'bold',
    _hover: {
        backgroundColor: '#45a049',
    },
  });

  const editableNoteStyles = airCss({
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    background: 'rgb(1 12 32 / 30%);',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 1000,
});

const inputStyles = airCss({

    border: 'none',
    borderRadius: '5px',
    padding: '10px',
    fontSize: '16px',
});
const editButtonStyles = airCss({
    background: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    padding: '10px',
    margin: '10px', 
    cursor: 'pointer',
    _hover: {
        background: '#45a049',
    },
});

const overlayStyles = airCss({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
});

const deleteButtonStyles = airCss({
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(255, 0, 0, 0.6)',
    border: 'none',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    _hover: {
        background: 'rgba(255, 0, 0, 0.8)',
    },
});

const aiButtonStyles = airCss({
    background: 'rgba(255, 255, 255, 0.6)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'background 0.3s, transform 0.3s',
    width: '20%',
    _hover: {
        background: 'rgba(255, 255, 255, 0.3)',
        transform: 'scale(1.05)',
    },
});

const spin = keyframes({
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' }
});

const spinnerStyles = airCss({
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid rgba(255,255,255,.3)',
    borderRadius: '50%',
    borderTopColor: '#fff',
    animation: spin('1s ease-in-out infinite'),
    '-webkit-animation': spin('1s ease-in-out infinite'),
});

// functions

async function sendMessageToAI(prompt, message) {
    const url = 'http://localhost:1234/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    };
  
    const body = JSON.stringify({
      model: 'TheBloke/stablelm-zephyr-3b-GGUF',
      messages: [
        { role: 'system', content: 'Assistant' },
        { role: 'user', content: prompt + message  }
      ],
      temperature: 0.7,
      max_tokens: -1,
      stream: true
    });
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
        mode: 'cors',
        credentials: 'omit'
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const reader = response.body.getReader();
      let assembledMessage = '';
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.slice(6);
            if (content.trim() === '[DONE]') {
              // Stream is finished
              continue;
            }
            try {
              const jsonData = JSON.parse(content);
              if (jsonData.choices && jsonData.choices[0].delta && jsonData.choices[0].delta.content) {
                assembledMessage += jsonData.choices[0].delta.content;
              }
            } catch (jsonError) {
              console.warn('Error parsing JSON:', jsonError, 'for line:', line);
            }
          }
        }
      }
      return assembledMessage.trim().replaceAll('"','');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}


const CategorySelector = AirComponent('category-selector', function({ categories, note, onUpdateNote }) {
    const [hoveredCategory, setHoveredCategory] = createState(null);
  
    const categoryStyle = (category) => airCss({
      padding: '10px 10px',
      margin: '0 5px',
      backgroundColor: () => note().category === category.name ? '#3498db' : 'white',
      color: () => note().category === category.name ? 'white' : '#333',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      },
    });
  
    const tooltipStyle = airCss({
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '5px 10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',

      borderRadius: '4px',
      fontSize: '12px',
      pointerEvents: 'none',
      opacity: () => hoveredCategory() ? 1 : 0,
      transition: 'opacity 0.3s ease',
    });
  
    return () => html`
      <div style="     
        display: flex;
        padding: 20px;
        justify-content: center;
        ">
        ${categories().map(category => category.name === 'All Notes' ? "" : html`
          <button
            onclick="${() => onUpdateNote({ ...note(), category: category.name })}"
            onmouseenter="${() => setHoveredCategory(category)}"
            onmouseleave="${() => setHoveredCategory(null)}"
            style="${categoryStyle(category)()}"
          >
            ${category.name}
          </button>
        `)}
        <div style="${tooltipStyle()}">
          ${hoveredCategory()?.description || ''}
        </div>
      </div>
    `;
  });

  const EditableNote = AirComponent('editable-note', function({ note, categories, onSave, onClose, detached = false, closePopup = null, refetch = null }) {
      const [editedNote, setEditedNote] = createState(note);
      const [isLoading, setIsLoading] = createState(false);
  
      const updateNoteField = (field, value) => {
          setEditedNote(prevNote => ({ ...prevNote, [field]: value }));
      };
      editedNote.onUpdate((newNote) => {
        console.log("newNote", newNote)
      })
      const saveNote = () => {
         
          onSave(editedNote());
      };
  
      const titlePrompt = "Here is the content of a note, please create a short title for it. Return just the title and no other text, use no headings or colon. Use no punctuation.: ";
      
      const getAITitle = () => {
          setIsLoading(true);
          sendMessageToAI(titlePrompt, editedNote().content)
              .then(r => {
                  updateNoteField('title', r);
                  setIsLoading(false);
              })
              .catch(error => {
                  console.error("Error getting AI title:", error);
                  setIsLoading(false);
              });
      };
  
      const detachWindow = () => {
        const popup = window.open("", note.title?.length > 50 ? note.title.slice(0, 50) + "..." : note.title || Math.random().toString(36).substring(2, 10).trim(), "menubar=no, location=no, width=600,height=400");
        

        popup.location = "/note/" + note.id;
        onClose()        
      };
      
      return () => {
        return html`
          <div style="${editableNoteStyles()} ${detached ? "width:98%;height:95%;padding:1em;justify-content: center;background:gray;" : ''}">
              <div style="display: flex; flex-direction: row; gap:1em; margin-bottom: 10px;">
                  <input
                      style="${inputStyles()} width: 80%;"
                      value="${editedNote().title}"
                      oninput="${(e) => updateNoteField('title', e.target.value)}"
                      placeholder="Note Title"
                  />
  
                  <select 
                      style="${inputStyles()} width: 20%;"
                      oninput="${(e) => updateNoteField('status', e.target.value)}"
                  >   
                      <option ${editedNote().status === 'To Do' ? 'selected' : ''} value="To Do" style="color: black;">To Do</option>
                      <option ${editedNote().status === 'In Progress' ? 'selected' : ''} value="In Progress" style="color: black;">In Progress</option>
                      <option ${editedNote().status === 'Done' ? 'selected' : ''} value="Done" style="color: black;">Done</option>
                  </select>
                  <button 
                      style="${aiButtonStyles()}"
                      onclick="${getAITitle}"
                      ${isLoading() ? 'disabled' : ''}
                  >
                      ${isLoading() ? html`<div style="${spinnerStyles()}"></div>` : 'Get AI Title'}
                  </button>
              </div>
              
              <textarea
                  style="${inputStyles()} ${detached ? "height: 80vh;": "height: 40vh;"} margin-bottom: 10px;"
                  value="${editedNote().content}"
                  oninput="${(e) => updateNoteField('content', e.target.value)}"
                  placeholder="Note Content"
              >${editedNote().content}</textarea>
  
              <category-selector
                  props=${{
                      categories,
                      note: editedNote,
                      onUpdateNote: setEditedNote
                  }}
              ></category-selector>
              
              <div style="display: flex; justify-content: space-between;">
                  <button style="${editButtonStyles()}" onclick="${()=>{
                        onSave(editedNote());
                  }}">Save</button>
                  <button style="${editButtonStyles()} background: #f44336;" onclick="${() => {
                    
                    onClose();
                    if (closePopup) {
                        closePopup();
                    }
                    
                }}">Close</button>
                  ${!detached ? html`
                      <button style="${editButtonStyles()} background: #4CAF50;" onclick="${detachWindow}">Detach</button>
                  ` : ''}
              </div>
          </div>
      `;
      };
    });
const CategoryButton = AirComponent('category-button', function({category, onColorChange, onCategoryClick, isSelected}) {
    const [showColorPicker, setShowColorPicker] = createState(false);
    const [tempColor, setTempColor] = createState(category.colour);

    const handleColorChange = (e) => {
        setTempColor(e.target.value);
    };

    const confirmColorChange = () => {
        onColorChange(category.name, tempColor());
        setShowColorPicker(false);
    };


    return () => {
        return html`
        <li style="${categoryItemStyles()}">
            <button style="${categoryBtnStyles()}" onclick="${() => onCategoryClick(category.name)}">
                <span 
                    style="${categoryIconStyles()} background: ${category.colour}"
                    onclick="${(e) => {
                        e.stopPropagation();
                        setShowColorPicker(!showColorPicker());
                        setTempColor(category.colour);
                    }}"
                ></span>
                ${category.name}
            </button>
            ${showColorPicker() ? html`
                <div style="${colorPickerStyles()}">
                    <input 
                        type="color" 
                        value="${tempColor()}"
                        onchange="${handleColorChange}"
                    />
                    <button 
                        style="${buttonStyles()}"
                        onclick="${confirmColorChange}"
                    >
                        Confirm Color
                    </button>
                </div>
            ` : ''}
        </li>
    `};
});

const NoteCard = AirComponent('note-card', function({ note, onOpen, onDelete }) {
    const [selectedCategory, setSelectedCategory] = globalState("selectedCategory");
    const [categories, setCategories] = globalState("categories");
    const categoryLabelStyles = airCss({
        backgroundColor: categories.find(cat => cat.name == note.category).colour,
        backdropFilter: 'blur(10px)',
        padding: '10px',

        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        width: 'fit-content',
        marginTop: '10px',
        top: '10px',
        right: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    });
    return () => {
        return html`
        <div style="${noteCardStyles()}" onclick="${() => onOpen(note)}">
            <h3 style="${noteCardTitleStyles()}">${note.title}</h3>
            <p style="${noteCardContentStyles()}">${note.preview}</p>
            <button 
                style="${deleteButtonStyles()}" 
                onclick="${(e) => {
                    e.stopPropagation();
                    onDelete(note.id);
                }}"
            >
                ×
            </button>
      
            ${selectedCategory() === 'All Notes' ? html`<div style="${categoryLabelStyles()}">${note.category}</div>` : ''}
        </div>
    `};
});

const CategoryIndicator = AirComponent('category-indicator', function({ selectedCategory, getCategoryColor }) {
    const containerStyles = airCss({
        display: () => selectedCategory() === 'All Notes' ? 'none' : 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    });

    const stripStyles = airCss({
        width: '100%',
        height: '4px',
        backgroundColor: () => getCategoryColor(selectedCategory()),
    });

    const tabStyles = airCss({
        padding: '4px 12px',
        borderRadius: '0 0 8px 8px',
        backgroundColor: () => getCategoryColor(selectedCategory()),

        fontSize: '12px',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    });

    return () => html`
        <div style="${containerStyles()}">
            <div style="${stripStyles()}"></div>
            <div style="${tabStyles()}">${selectedCategory()}</div>
        </div>
    `;
});


const swimLaneStyles = airCss({
    position: "relative",
    padding: "20px",
    "border-radius": "15px",
    "background-color": "white", /* Background color of the element */
    "z-index": "1",
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    margin:{
        top: "2em",
        left: "2em",
        right: "2em"
    },
    _before: {
        content: '',
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        "border-radius": "inherit",
        padding: "5px", 
        background: "linear-gradient(45deg, #3498db87, #8e44ad94)",
        "-webkit-mask": "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        "mask-composite": "exclude",
        "-webkit-mask-composite": "destination-out",
        "z-index": "-1"
    }
});

const swimLaneTitleStyles = airCss({
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
});
const dropIndicatorStyles = airCss({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20%',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
});

const SwimLane = AirComponent('swim-lane', function({ saveNote, title, notes, onOpenNote, onDeleteNote }) {
    
    const [showDrop, setShowDrop] = createState(false);
    const [ghostCard, setGhostCard] = createState(null);

    const [currentDraggedNote, setCurrentDraggedNote] = globalState("draggedNote");

    return () => html`
        <div data-lane="${title}" style="${swimLaneStyles()}">
            <h3 style="${swimLaneTitleStyles()} pointer-events:none;">${title}</h3>
            <div style="${notesGridStyles()} min-height: 100px;"
                ondragover="${(e) => {
                    e.preventDefault();
                }}"
                ondragenter="${(e) => {
                    e.preventDefault();
                    if (currentDraggedNote()) {
                        setGhostCard(currentDraggedNote());
                        setShowDrop(true);
                    }
                }}"
                ondragleave="${(e) => {
                    e.preventDefault();
                    setGhostCard(null);
                    setShowDrop(false);
                }}"
                ondrop="${(e) => {
                    e.preventDefault();
                    const note = JSON.parse(e.dataTransfer.getData('text/plain'));
                    note.status = e.target.closest("[data-lane]").dataset.lane;
                    saveNote(note);
                    setCurrentDraggedNote(null); // Clear the global state
                }}"
            >
                ${showDrop() ? html`
                    <div style="${dropIndicatorStyles()}">drop here</div>
                ` : ''}
                ${notes.map(note => html`
                    <note-card 
                        props=${{
                            note,
                            onOpen: onOpenNote,
                            onDelete: onDeleteNote
                        }}
                        draggable="true"
                        ondragstart="${(e) => {
                            e.dataTransfer.setData('text/plain', JSON.stringify(note));
                            e.dataTransfer.effectAllowed = 'move';
                            setCurrentDraggedNote(note); // Set the global state
                        }}"
                        ondragend="${() => {
                            setCurrentDraggedNote(null); // Clear the global state
                        }}"
                    ></note-card>
                `)}
                ${ghostCard() ? html`
                    <note-card 
                        props=${{
                            note: ghostCard(),
                            onOpen: onOpenNote,
                            onDelete: onDeleteNote
                        }}
                        style="pointer-events: none;"
                    ></note-card>
                ` : ''}
            </div>
        </div>
    `;
});

const DetachedNote = AirComponent('detached-note-component', function( { RouteParams, RouterProps } ) {
    const { data: note, isLoading, error, refetch } = createQuery('notes', ()=>{
        console.log("fetching note", RouteParams.id)
    
        const n = fetchNote(RouteParams.id);
        console.log("fetched note", n)
        return n
    });
    const [categories, setCategories] = globalState("categories");
    return () => html`
        <div>
            ${isLoading() ? html`<div style="margin:auto;width:100%;height:100%;display:flex;justify-content:center;align-items:center;">
                <span style="font-size:24px;">Loading...</span>
                <div style="${spinnerStyles()}"/>
            </div>` : html`
                <editable-note props=${{
                    categories,
                    note: note(),
                    onClose: ()=>{
                        if (window.opener) {
                            window.opener.postMessage('detached note closed', '*');
                        }
                        setEditingNote(null)
                        },
                    detached: true,
                    closePopup: ()=>window.close(),
                    onSave: async (n)=>{
                        await RouterProps.saveNote(n);
                        window.opener.postMessage('detached note saved', '*');
                        },
                }}></editable-note>
            `}
        </div>
    `;
});
const fetchNotesMetadata = async () => {
    return await fetch('/api/notes')
    .then(response => response.json())
};
const fetchNote = async (id) => {
    return await fetch(`/api/notes/${id}`)
    .then(response => response.json())
};
const newNote = async (note) => {
    return await fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note)
    })
};
const updateNote = async (note) => {
    
    return await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note)
    })
};
const deleteNote = async (noteId) => {
    return await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
};
const [editingNote, setEditingNote] = createState(null);

const [categories, setCategories] = createState([
    {name: 'All Notes', colour: '#3498db'},
    {name: 'Work', colour: '#e74c3c'},
    {name: 'Personal', colour: '#2ecc71'},
    {name: 'Ideas', colour: '#f1c40f'},
], {global: "categories"});
export const GlassmorphismNotes = AirComponent('glassmorphism-notes', function({RouterProps}) {
    const { data: notes, isLoading, error, refetch } = RouterProps.allNotesQuery;
    
    
    //const [notes,setNotes] = createState(null)
    console.log("notes: ", notes, refetch)

    const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return; // Ensure the message is from the correct origin

        if (event.data === 'detached note closed') {
            if (refetch) {
                refetch();
            }
        }
        if (event.data === 'detached note saved') {
            console.log('Received: detached note saved');
            if (refetch) {
                refetch();
            }
        }
    }
    onMount(()=>{
        console.log("dick damage")
        window.addEventListener('message', handleMessage);
        return ()=>{
            console.log("dick damaged")
            window.removeEventListener('message', handleMessage);
        }
    })
    
    const [selectedCategory, setSelectedCategory] = createState('All Notes', { global: "selectedCategory" });

    // New global state to store the currently dragged note
    const [currentDraggedNote, setCurrentDraggedNote] = createState(null, { global: 'draggedNote' });

    const handleColorChange = (categoryName, newColor) => {
        setCategories(categories().map(cat => 
            cat.name === categoryName ? {...cat, colour: newColor} : cat
        ));
    };

    const openNote = (note) => {
        fetchNote(note.id).then(r => {
            setEditingNote(r)
        })
    };

    const closeNote = () => {
        setEditingNote(null);
    };

    const createNewNote = () => {
        const newNote = {
            id: '',
            title: '',
            content: '',
            category: 'All Notes',
            status: 'To Do',
        };
        setEditingNote(newNote);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const filteredNotes = () => {
        if (selectedCategory() === 'All Notes') {
            return notes();
        } else {
            return notes().filter(note => note.category === selectedCategory());
        }
    };

    const getCategoryColor = (categoryName) => {
        const category = categories().find(cat => cat.name === categoryName);
        return category ? category.colour : '#3498db'; // Default color
    };

    const mainContentWrapperStyles = airCss({
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    });

    const statuses = ['To Do', 'In Progress', 'Done'];
    isLoading.onUpdate((isLoading) => {
        console.log("isLoading: ", isLoading)
    })
    return () => html`
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;

            }
        </style>
        <div style="${globalStyles()}${bodyStyles()}">
            <div style="${sidebarStyles()}">
                <h2 style="${sidebarTitleStyles()}">Categories</h2>
                <ul style="${categoryListStyles()}">
                    ${categories().map(category => html`
                        <category-button 
                            props=${{ 
                                category, 
                                onColorChange: handleColorChange,
                                onCategoryClick: handleCategoryClick,
                                isSelected: () => selectedCategory() === category.name
                            }}
                        ></category-button>
                    `)}
                </ul>
            </div>
            <div style="${mainContentWrapperStyles()}">
                ${isLoading() ? html`
                    <div style="margin:auto;width:100%;height:100%;display:flex;justify-content:center;align-items:center;">
                        <span style="font-size:24px;">Loading...</span>
                        <div style="${spinnerStyles()}"/>
                    </div>
                    ` 
                    :  
                html`<div style="${mainContentStyles()}">
                    <header style="${headerStyles()}">
                        <h1 style="${headerTitleStyles()}">Notes</h1>
                        <button style="${addNoteBtnStyles()}" onclick="${createNewNote}">+ New Note</button>
                    </header>
                    <category-indicator
                        props=${{
                            selectedCategory,
                            getCategoryColor
                        }}
                    ></category-indicator>
                    
                    ${statuses.map(status => html`
                        <swim-lane 
                            props=${{
                                saveNote:RouterProps.saveNote,
                                title: status,
                                notes: filteredNotes().filter(note => note.status === status),
                                onOpenNote: openNote,
                                onDeleteNote: (id)=>{
                                    deleteNote(id).then(r => {
                                        if (r.ok) {
                                            refetch();
                                        }
                                    });
                                }
                            }}
                        ></swim-lane>
                    `)}
                </div>`}
            </div>
            ${editingNote() ? html`
                <div style="${overlayStyles()}"></div>
                <editable-note props=${{
                    categories: categories,
                    note: editingNote(),
                    onSave: RouterProps.saveNote,
                    onClose: ()=>{ closeNote() },
                    refetch
                }}></editable-note>
            ` : ''}
        </div>
    `;
});

Router.Routes([
    {
        path: '/note/:id',
        component: 'detached-note-component',
    },
    { path: '*', component: 'glassmorphism-notes' },
]);


export const NotesApp = AirComponent('notes-app', function() {
    const allNotesQuery = createQuery('notes', fetchNotesMetadata, { //{ data: notes, isLoading, error, refetch }
        cacheTime: 10 * 60 * 1000, // 10 minutes
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
    });
    const saveNote = async (note) => {
        try {
          if (note.id) {
            const r = await updateNote(note);
            if (r.ok) {
              console.log("refetch");
              await allNotesQuery.refetch();
            }
          } else {
            const r = await newNote(note);
            if (r.ok) {
              console.log("refetch");
              await allNotesQuery.refetch();
            }
          }
        } finally {
          setEditingNote(null);
        }
      };
    return () => html`
        <div>
            <router props=${{allNotesQuery, saveNote}} ></router>
        </div>
    `;
});