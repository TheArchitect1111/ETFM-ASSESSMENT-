const handleSendSnapshot = async (e) => {
  e.preventDefault();
  
  if (!firstName.trim() || !email.trim()) {
    alert('Please fill in both fields');
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        email,
        answers
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send snapshot');
    }

    const data = await response.json();
    setCurrentScreen('confirmation');
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
