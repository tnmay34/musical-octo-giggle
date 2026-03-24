    // DOM Elements
    const transactionForm = document.getElementById('transactionForm');
    const transactionsList = document.getElementById('transactionsList');
    const balanceAmount = document.getElementById('balanceAmount');
    const incomeAmount = document.getElementById('incomeAmount');
    const expenseAmount = document.getElementById('expenseAmount');
    const incomeOption = document.getElementById('incomeOption');
    const expenseOption = document.getElementById('expenseOption');
    const themeToggle = document.getElementById('themeToggle');
    const categorySelect = document.getElementById('category');
    
    // Initialize transactions array
    let transactions = [];
    
    // Theme management
    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Update icon
      themeToggle.innerHTML = newTheme === 'dark' ?
        '<i class="fas fa-sun"></i>' :
        '<i class="fas fa-moon"></i>';
    }
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', 'light');
    
    // Update category options based on transaction type
    function updateCategoryOptions(type) {
      // Clear existing options
      categorySelect.innerHTML = '';
      
      if (type === 'income') {
        // Income categories
        const incomeCategories = [
          { value: 'salary', text: 'Salary' },
          { value: 'freelance', text: 'Freelance' },
          { value: 'investment', text: 'Investment' },
          { value: 'other', text: 'Other' }
        ];
        
        incomeCategories.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.value;
          option.textContent = cat.text;
          categorySelect.appendChild(option);
        });
      } else {
        // Expense categories
        const expenseCategories = [
          { value: 'food', text: 'Food' },
          { value: 'shopping', text: 'Shopping' },
          { value: 'transport', text: 'Transport' },
          { value: 'housing', text: 'Housing' },
          { value: 'entertainment', text: 'Entertainment' },
          { value: 'other', text: 'Other' }
        ];
        
        expenseCategories.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.value;
          option.textContent = cat.text;
          categorySelect.appendChild(option);
        });
      }
    }
    
    // Update balance and summary
    function updateSummary() {
      let income = 0;
      let expenses = 0;
      
      transactions.forEach(transaction => {
        if (transaction.type === 'income') {
          income += transaction.amount;
        } else {
          expenses += transaction.amount;
        }
      });
      
      const balance = income - expenses;
      
      balanceAmount.textContent = `₹${balance.toLocaleString('en-IN')}`;
      incomeAmount.textContent = `₹${income.toLocaleString('en-IN')}`;
      expenseAmount.textContent = `₹${expenses.toLocaleString('en-IN')}`;
    }
    
    // Add transaction to DOM
    function addTransactionToDOM(transaction) {
      // Remove empty state if it exists
      const emptyState = transactionsList.querySelector('.empty-state');
      if (emptyState) {
        transactionsList.removeChild(emptyState);
      }
      
      const transactionElement = document.createElement('div');
      transactionElement.className = 'transaction';
      
      const iconClass = transaction.type === 'income' ? 'income-icon' : 'expense-icon';
      const icon = transaction.type === 'income' ? 'fa-arrow-down' : 'fa-arrow-up';
      const amountClass = transaction.type === 'income' ? 'income-amount' : 'expense-amount';
      const amountPrefix = transaction.type === 'income' ? '+' : '-';
      const description = transaction.description ||
        transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1);
      
      // Format date as "Today", "Yesterday", or "Apr 5"
      const today = new Date();
      const transactionDate = new Date(transaction.date);
      const diffDays = Math.floor((today - transactionDate) / (1000 * 60 * 60 * 24));
      
      let dateString;
      if (diffDays === 0) dateString = 'Today';
      else if (diffDays === 1) dateString = 'Yesterday';
      else dateString = transactionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      transactionElement.innerHTML = `
                <div class="transaction-details">
                    <div class="transaction-icon ${iconClass}">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="transaction-info">
                        <h3>${description}</h3>
                        <p>
                            <i class="fas fa-tag"></i>
                            ${transaction.category} • 
                            <i class="far fa-calendar-alt"></i>
                            ${dateString}
                        </p>
                    </div>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${amountPrefix}₹${transaction.amount.toLocaleString('en-IN')}
                </div>
            `;
      
      transactionsList.insertBefore(transactionElement, transactionsList.firstChild);
    }
    
    // Toggle type selection
    incomeOption.addEventListener('click', () => {
      incomeOption.classList.add('active');
      expenseOption.classList.remove('active');
      updateCategoryOptions('income');
    });
    
    expenseOption.addEventListener('click', () => {
      expenseOption.classList.add('active');
      incomeOption.classList.remove('active');
      updateCategoryOptions('expense');
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Form submit handler
    transactionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const amountInput = document.getElementById('amount');
      const amountValue = amountInput.value.trim();
      
      // Validate amount
      if (!amountValue || isNaN(amountValue) || parseFloat(amountValue) <= 0) {
        amountInput.focus();
        return;
      }
      
      const description = document.getElementById('description').value;
      const amount = parseFloat(amountValue);
      const type = document.querySelector('input[name="type"]:checked').value;
      const category = document.getElementById('category').value;
      
      const transaction = {
        id: Date.now(),
        description,
        amount,
        type,
        category,
        date: new Date()
      };
      
      transactions.push(transaction);
      addTransactionToDOM(transaction);
      updateSummary();
      
      // Reset form (keep type selection)
      transactionForm.reset();
      if (type === 'income') {
        incomeOption.click();
      } else {
        expenseOption.click();
      }
      document.getElementById('amount').focus();
    });
    
    // Initialize with sample data (optional)
    function initSampleData() {
      const sampleTransactions = [
      {
        id: 1,
        description: "Salary",
        amount: 50000,
        type: "income",
        category: "salary",
        date: new Date()
      },
      {
        id: 2,
        description: "Groceries",
        amount: 2500,
        type: "expense",
        category: "food",
        date: new Date()
      },
      {
        id: 3,
        amount: 1200,
        type: "expense",
        category: "transport",
        date: new Date(Date.now() - 86400000) // Yesterday
      }];
      
      transactions = sampleTransactions;
      transactions.forEach(transaction => {
        addTransactionToDOM(transaction);
      });
      updateSummary();
    }
    
    updateCategoryOptions('expense');
    
    initSampleData();