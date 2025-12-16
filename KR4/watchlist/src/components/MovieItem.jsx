import React, { useState } from 'react';
import { useMovies, STATUSES } from '../context/MoviesContext.jsx';

export default function MovieItem({ movie }) {
    const { dispatch } = useMovies();

    // режим редактирования
    const [isEdit, setIsEdit] = useState(false);

    // локальный драфт для формы
    const [draft, setDraft] = useState({
        title: movie?.title ?? '',
        year: movie?.year ?? '',
        genres: Array.isArray(movie?.genres) ? movie.genres.join(', ') : (movie?.genres ?? ''),
        note: movie?.note ?? '',
    });

    // открыть редактор — актуализируем драфт из movie
    function startEdit() {
        setDraft({
            title: movie?.title ?? '',
            year: movie?.year ?? '',
            genres: Array.isArray(movie?.genres) ? movie.genres.join(', ') : (movie?.genres ?? ''),
            note: movie?.note ?? '',
        });
        setIsEdit(true);
    }

    // отмена редактирования
    function cancelEdit() {
        setIsEdit(false);
    }

    // сохранить изменения
    function save(e) {
        e.preventDefault();
        dispatch({
            type: 'UPDATE',
            payload: {
                id: movie.id,
                title: draft.title.trim() || movie.title,
                year: draft.year ? Number(draft.year) : null,
                genres: draft.genres
                    ? draft.genres.split(',').map(g => g.trim().toLowerCase()).filter(Boolean)
                    : [],
                note: draft.note.trim(),
            },
        });
        setIsEdit(false);
    }

    // просмотр → жанры текстом
    const genresText = Array.isArray(movie.genres) ? movie.genres.join(', ') : (movie.genres || '');

    return (
        <div className="card" role="article">
            {isEdit ? (
                <form className="edit-form" onSubmit={save}>
                    <div className="row">
                        <label className="field">
                            <span className="field-label">Название</span>
                            <input
                                value={draft.title}
                                onChange={e => setDraft({ ...draft, title: e.target.value })}
                                required
                            />
                        </label>

                        <label className="field">
                            <span className="field-label">Год</span>
                            <input
                                type="number"
                                min="1888"
                                value={draft.year}
                                onChange={e => setDraft({ ...draft, year: e.target.value })}
                            />
                        </label>

                        <label className="field">
                            <span className="field-label">Жанры (через запятую)</span>
                            <input
                                value={draft.genres}
                                onChange={e => setDraft({ ...draft, genres: e.target.value })}
                            />
                        </label>
                    </div>

                    <label className="field">
                        <span className="field-label">Заметка</span>
                        <textarea
                            rows={4}
                            value={draft.note}
                            onChange={e => setDraft({ ...draft, note: e.target.value })}
                        />
                    </label>

                    <div className="actions">
                        <button className="primary" type="submit">Сохранить</button>
                        <button type="button" onClick={cancelEdit}>Отмена</button>
                    </div>
                </form>
            ) : (
                <>
                        <div className="card-title" title={movie.note || ''}>
                            {movie.title}{movie.year ? ` (${movie.year})` : ''}
                        </div>

                        {(genresText || movie.note) && (
                            <div className="card-sub">
                                {genresText && <span>{genresText}</span>}
                                {movie.note && <span> • {movie.note}</span>}
                            </div>
                        )}

                        {/* >>> СТАТУС — ВЕРНУЛИ <<< */}
                        <div className="card-meta">
    <span
        className={
            'badge ' +
            (movie.status === STATUSES.WATCHED ? 'ok' : 'warn')
        }
    >
      {movie.status === STATUSES.WATCHED
          ? 'посмотрено'
          : 'хочу посмотреть'}
    </span>
                        </div>

                        <div className="actions">
                            <button
                                type="button"
                                onClick={() => dispatch({ type: 'TOGGLE_STATUS', id: movie.id })}
                            >
                                {movie.status === STATUSES.WATCHED ? 'В «хочу»' : 'В «посмотрено»'}
                            </button>
                            <button type="button" onClick={startEdit}>Редакт.</button>
                            <button type="button" className="danger"
                                    onClick={() => dispatch({ type: 'REMOVE', id: movie.id })}>
                                Удалить
                            </button>
                        </div>

                </>
            )}
        </div>
    );
}
