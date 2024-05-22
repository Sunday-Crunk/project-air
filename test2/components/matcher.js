import { AirComponent, createState, globalState, html, airCss } from '../air-js/core/air.js';


const exampleData = [
    {
        "reference_code": "CA ON00311 PF41",
        "slug": "john-honsberger-fonds",
        "title": "John Honsberger fonds",
        "repository": "The Law Society of Upper Canada Archives",
        "physical_characteristics": "Some items in the fonds are stored folded.",
        "level_of_description": "Fonds",
        "creators": [
          "Honsberger, John David"
        ],
        "creation_dates": [
          "1763-2012"
        ],
        "place_access_points": [
          "Toronto"
        ],
        "thumbnail_url": "http:\/\/127.0.0.1\/uploads\/r\/law-society-of-upper-canada-archives\/2\/5\/1\/251a9152c6e71751519dc49086d62f3abde38d34619f66516ca0edf97076a1cf\/honsberger_142.jpg"
      },
      {
        "reference_code": "CA ON00311 PF41-PF41-5-2011053-026",
        "slug": "thomas-b-townsend-to-thomas-b-townsend-the-younger-deed-of-land",
        "title": "Thomas B. Townsend to Thomas B. Townsend the younger: deed of land",
        "repository": "The Law Society of Upper Canada Archives",
        "physical_characteristics": "Item is stored folded.",
        "level_of_description": "Item",
        "creation_dates": [
          "30 May 1903"
        ]
      },
      {
        "reference_code": "CA ON00311 PF41-PF41-5-2011053-025",
        "slug": "charles-marriott-et-al-to-jane-m-kerr-deed-of-land-situate-on-rosedale-road-toronto",
        "title": "Charles Marriott et al to Jane M. Kerr: deed of land situate on Rosedale Road, Toronto",
        "repository": "The Law Society of Upper Canada Archives",
        "physical_characteristics": "Item is stored folded.",
        "level_of_description": "Item",
        "creation_dates": [
          "26 Nov. 1900"
        ]
      },
      {
        "reference_code": "CA ON00311 PF41-PF41-5-2011053-024",
        "slug": "mortgage-william-hanlan-et-al-to-simpson-hill",
        "title": "Mortgage : William Hanlan et al to Simpson Hill",
        "repository": "The Law Society of Upper Canada Archives",
        "level_of_description": "Item",
        "creation_dates": [
          "8 Mar. 1900"
        ]
      },
      {
        "reference_code": "CA ON00311 PF41-PF41-5-2011053-023",
        "slug": "quit-claim-deed-daniel-hanlon-et-al-to-william-hanlon",
        "title": "Quit claim deed: Daniel Hanlon et al to William Hanlon",
        "repository": "The Law Society of Upper Canada Archives",
        "level_of_description": "Item",
        "creation_dates": [
          "14 Mar. 1895"
        ]
      },
      {
        "reference_code": "CA ON00311 PF41-PF41-5-2011053-019",
        "slug": "abstracts-of-title-2",
        "title": "Abstracts of title",
        "repository": "The Law Society of Upper Canada Archives",
        "physical_characteristics": "Items in this file were previously folded.",
        "level_of_description": "File",
        "creation_dates": [
          "1894-1895, 1900"
        ]
      },
      {
        "reference_code": "CA ON00311 PF41-PF41-5-2011053-022",
        "slug": "mortgage-william-hanlon-to-the-trust-loan-co-of-canada",
        "title": "Mortgage: William Hanlon to the Trust & Loan Co. of Canada",
        "repository": "The Law Society of Upper Canada Archives",
        "level_of_description": "Item",
        "creation_dates": [
          "2 Mar. 1895"
        ]
      },
      {
        "reference_code": "CA ON00311 PF41-PF41-5-2011053-018",
        "slug": "mortgage-william-hanlon-to-richard-coffey",
        "title": "Mortgage: William Hanlon to Richard Coffey",
        "repository": "The Law Society of Upper Canada Archives",
        "level_of_description": "Item",
        "creation_dates": [
          "19 Mar. 1894"
        ]
      },
      {
        "reference_code": "CA ON00311 PF41-PF41-5-2011053-021",
        "slug": "conveyance-john-hanlon-et-al-to-william-hanlon",
        "title": "Conveyance: John Hanlon et al to William Hanlon",
        "repository": "The Law Society of Upper Canada Archives",
        "level_of_description": "Item",
        "creation_dates": [
          "11 Feb. 1895"
        ]
      },
      {
        "reference_code": "CA ON00311 PF41-PF41-5-2011053-020",
        "slug": "hanlon-hill-certificates",
        "title": "Hanlon & Hill: certificates",
        "repository": "The Law Society of Upper Canada Archives",
        "level_of_description": "File",
        "creation_dates": [
          "1894-1900"
        ]
      }
  ]
  export const MemoryBrowser = AirComponent('archive-explorer', function() {

    const [records, setRecords] = createState([]);
    const [searchTerm, setSearchTerm] = createState('');
    const [currentPage, setCurrentPage] = createState(1);
    const [loading, setLoading] = createState(true);
    const [selectedFilter, setSelectedFilter] = createState('');
    const recordsPerPage = 5;

    const theme = {
      colors: {
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        background: '#f7fff7',
        text: '#1a535c',
        highlight: '#ffe66d',
        frameBorder: '#4ecdc4'
      },
      fontSize: '14px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
    };
  
    const styles = {
      frame: airCss({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        height: '90%',
        border: `3px solid ${theme.colors.frameBorder}`,
        boxShadow: theme.boxShadow,
        borderRadius: theme.borderRadius,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        animation: 'fadeIn 0.5s ease-in-out'
      }),
      container: airCss({
        fontFamily: "'Montserrat', sans-serif",
        color: theme.colors.text,
        padding: '30px',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius,
        overflowY: 'auto',
        flexGrow: 1
      }),
      searchBox: airCss({
        padding: '15px',
        border: 'none',
        borderRadius: theme.borderRadius,
        marginBottom: '30px',
        fontSize: '18px',
        transition: theme.transition,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        __focus: {
          outline: 'none',
          boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`
        }
      }),
      filterDropdown: airCss({
        padding: '10px',
        border: 'none',
        borderRadius: theme.borderRadius,
        marginBottom: '30px',
        fontSize: '16px',
        backgroundColor: theme.colors.secondary,
        color: '#fff',
        appearance: 'none',
        backgroundImage: 'linear-gradient(45deg, transparent 50%, #fff 50%)',
        backgroundPosition: 'right 10px center',
        backgroundSize: '8px 8px',
        backgroundRepeat: 'no-repeat',
        transition: theme.transition,
        __focus: {
          outline: 'none',
          boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`
        }
      }),
      resultList: airCss({
        listStyle: 'none',
        padding: 0
      }),
      resultItem: airCss({
        backgroundColor: '#fff',
        padding: '25px',
        marginBottom: '20px',
        borderRadius: theme.borderRadius,
        boxShadow: theme.boxShadow,
        cursor: 'pointer',
        transition: theme.transition,
        __hover: {
          transform: 'translateY(-5px)',
          boxShadow: `0 8px 12px rgba(0, 0, 0, 0.1)`
        }
      }),
      pagination: airCss({
        marginTop: '30px',
        textAlign: 'center'
      }),
      pageButton: airCss({
        padding: '12px 18px',
        margin: '0 5px',
        backgroundColor: theme.colors.primary,
        color: '#fff',
        border: 'none',
        borderRadius: theme.borderRadius,
        cursor: 'pointer',
        fontSize: '16px',
        transition: theme.transition,
        __hover: {
          backgroundColor: theme.colors.secondary,
          transform: 'scale(1.1)'
        },
        __disabled: {
          opacity: 0.6,
          cursor: 'not-allowed'
        }
      }),
      loadingMessage: airCss({
        textAlign: 'center',
        marginTop: '30px',
        fontSize: '24px',
        color: theme.colors.primary
      }),
      thumbnail: airCss({
        maxWidth: '100%',
        height: 'auto',
        borderRadius: theme.borderRadius,
        boxShadow: theme.boxShadow,
        transition: theme.transition,
        __hover: {
          transform: 'scale(1.05)'
        }
      })
    };
  
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const [meState, setMeState] = globalState("me") 
      console.log("global state me: ", meState())
      test.revert()
      const sampleData = {
        "total": 1143,
        results: exampleData
      };
  
      setRecords(sampleData.results);
      setLoading(false);
    };
  
    const filterProperties = () => {
      const props = new Set();
      records.forEach(record => {
        Object.keys(record).forEach(key => props.add(key));
      });
      return Array.from(props);
    };
  
    const filteredRecords = () => {
        const searchTermLower = searchTerm.toLowerCase();
        if (selectedFilter() === '' || selectedFilter() === 'Show All') {
            
            return records.filter(record =>
                 // Ensure property exists on the record.
                (searchTermLower === '' || Object.values(record).some(value => 
                    String(value).toLowerCase().includes(searchTermLower)
                ))
            );  // Return all records immediately if no filter is applied.
        }
        return records.filter(record =>
            record.hasOwnProperty(selectedFilter) &&  // Ensure property exists on the record.
            (searchTermLower === '' || Object.values(record).some(value => 
                String(value).toLowerCase().includes(searchTermLower)
            ))
        );
    };
    
    
    
  
    const paginatedRecords = () => {
      const startIndex = (currentPage - 1) * recordsPerPage;
      const endIndex = startIndex + recordsPerPage;
      return filteredRecords().slice(startIndex, endIndex);
    };
  
    const totalPages = () => Math.ceil(filteredRecords().length / recordsPerPage);
  
    fetchData();
  
    return () => html`
      <div style="${styles.frame}">
        <div style="${styles.container}">
          <input
            type="text"
            placeholder="Search..."
            oninput="${(e) => setSearchTerm(e.target.value)}"
            style="${styles.searchBox}"
          />
  
          <select
            style="${styles.filterDropdown}"
            onchange="${(e) => setSelectedFilter(e.target.value)}"
          >
            <option value="">Show All</option>
            ${filterProperties().map(property => html`
              <option value="${property}">${property}</option>
            `)}
          </select>
  
          ${loading() ? html`<p style="${styles.loadingMessage}">Loading...</p>` : html`
            <ul style="${styles.resultList}">
              ${paginatedRecords().map(record => html`
                <li style="${styles.resultItem}">
                  <h3>${record.title}</h3>
                  <p>Reference Code: ${record.reference_code}</p>
                  <p>Repository: ${record.repository}</p>
                  ${record.thumbnail_url ? html`<img src="${record.thumbnail_url}" alt="${record.title}" style="${styles.thumbnail}">` : ''}
                </li>
              `)}
            </ul>
  
            <div style="${styles.pagination}">
              ${Array.from({length: totalPages()}, (_, i) => i + 1).map(page => html`
                <button
                  style="${styles.pageButton}"
                  onclick="${() => setCurrentPage(page)}"
                  ${page === currentPage() ? 'disabled' : ''}
                >${page}</button>
              `)}
            </div>
          `}
        </div>
      </div>
    `;
  });