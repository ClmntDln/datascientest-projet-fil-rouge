export const formatDate = (iso, withTime = false) =>
    new Date(iso).toLocaleDateString(
        'fr-FR',
        withTime
            ? {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
              }
            : { day: '2-digit', month: 'long', year: 'numeric' },
    );
