import { AirComponent, createState, html, airCss, globalState } from '../air-js/core/air.js';

// Utility functions
const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

// ExpenseForm Component
const ExpenseForm = AirComponent('expense-form', function() {
  const [description, setDescription] = createState('');
  const [amount, setAmount] = createState('');
  const [category, setCategory] = createState('');
  const [, addExpense] = globalState('expenses');

  const formStyle = airCss({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '300px',
    margin: '20px 0',
  });

  const inputStyle = airCss({
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  });

  const buttonStyle = airCss({
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    _hover: {
      backgroundColor: '#45a049',
    },
  });

  const handleSubmit = (e) => {
    console.log("submitting expense: ", description(), amount(), category())
    e.preventDefault();
    if (description() && amount() && category()) {
      addExpense((expenses) => [...expenses, { id: Date.now(), description: description(), amount: parseFloat(amount()), category: category() }]);
    }
  };

  return () => html`
    <form style="${formStyle()}" onsubmit="${handleSubmit}">
      <input style="${inputStyle()}" type="text" placeholder="Description" value="${description()}" oninput="${(e) => setDescription(e.target.value)}" />
      <input style="${inputStyle()}" type="number" placeholder="Amount" value="${amount()}" oninput="${(e) => setAmount(e.target.value)}" />
      <select style="${inputStyle()}" value="${category()}" onchange="${(e) => setCategory(e.target.value)}">
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Bills">Bills</option>
      </select>
      <button style="${buttonStyle()}" type="submit">Add Expense</button>
    </form>
  `;
});

// ExpenseList Component
const ExpenseList = AirComponent('expense-list', function() {
  const [expenses] = globalState('expenses');

  const listStyle = airCss({
    listStyle: 'none',
    padding: 0,
  });

  const itemStyle = airCss({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #eee',
    _hover: {
      backgroundColor: '#f9f9f9',
    },
  });

  return () => html`
    <ul style="${listStyle()}">
      ${expenses().map(expense => html`
        <li key="${expense.id}" style="${itemStyle()}">
          <span>${expense.description}</span>
          <span>${formatCurrency(expense.amount)} (${expense.category})</span>
        </li>
      `)}
    </ul>
  `;
});

// BudgetChart Component
const BudgetChart = AirComponent('budget-chart', function() {
  const [expenses] = globalState('expenses');
  const [budget] = createState(1000);

  const chartStyle = airCss({
    width: '100%',
    height: '20px',
    backgroundColor: '#e0e0e0',
    borderRadius: '10px',
    overflow: 'hidden',
  });

  const barStyle = airCss({
    height: '100%',
    backgroundColor: () => {
      const total = expenses().reduce((sum, exp) => sum + exp.amount, 0);
      return total > budget() ? '#ff4444' : '#4CAF50';
    },
    width: () => {
      const total = expenses().reduce((sum, exp) => sum + exp.amount, 0);
      return `${Math.min((total / budget()) * 100, 100)}%`;
    },
    transition: 'width 0.3s ease-out',
  });

  return () => html`
    <div>
      <h3>Budget Overview</h3>
      <div style="${chartStyle()}">
        <div style="${barStyle()}"></div>
      </div>
      <p>
        ${() => {
          const total = expenses().reduce((sum, exp) => sum + exp.amount, 0);
          return `${formatCurrency(total)} / ${formatCurrency(budget())}`;
        }}
      </p>
    </div>
  `;
});

// Main App Component
export const PersonalFinanceDashboard = AirComponent('personal-finance-dashboard', function() {
  createState([], { global: 'expenses' });

  const dashboardStyle = airCss({
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  });

  return () => html`
    <div style="${dashboardStyle()}">
      <h1>Personal Finance Dashboard</h1>
      <budget-chart></budget-chart>
      <expense-form></expense-form>
      <h2>Expense List</h2>
      <expense-list></expense-list>
    </div>
  `;
});