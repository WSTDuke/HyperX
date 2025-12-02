const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
    });
};

export default formatTime