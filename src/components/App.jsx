import { useState } from 'react';
import styles from 'styles/App.module.css';
import { Searchbar } from 'components/Searchbar';
import { ImageGallery } from 'components/ImageGallery';
import { ImageGalleryItem } from 'components/ImageGalleryItem';
import { finderInstance } from 'api/client';
import { Button } from 'components/Button';
import { Modal } from 'components/Modal';
import { Loader } from 'components/Loader';


export const App = () => {
  const [pictures, setPictures] = useState([]);
  const [bigPicture, setBigPicture] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  const [lookingValue, setLookingValue] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (ev) => {
    ev.preventDefault();
    setLookingValue(ev.target.value);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setIsLoading(true);
    try {
      const response = await finderInstance.get(
        `?q=${lookingValue}&key=26610249-d0ecba3c93167ffebf2a906f0&page=${page}&image_type=photo&orientation=horizontal&per_page=12`
      );
      setPictures(response.data.hits);
      setPage(2);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async (ev) => {
    ev.preventDefault();
    setIsLoading(true);
    try {
      const response = await finderInstance.get(
        `?q=${lookingValue}&page=${page}&key=26610249-d0ecba3c93167ffebf2a906f0&image_type=photo&orientation=horizontal&per_page=12`
      );
      setPictures([...pictures, ...response.data.hits]);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
    setPage(page + 1);
  };

  const handleModalOpenClose = (id) => {
    if (isModalOpen) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }

    const uniqueBigPicture = pictures.find(picture => picture.id === id);
    setBigPicture(uniqueBigPicture);
  };

  const handleModalCloseByKey = (ev) => { 
    if (ev.key === 'Escape' && isModalOpen) {
      setIsModalOpen(false);
    }
  };

  return (
    <div
      className={styles.App}
      onKeyDown={handleModalCloseByKey}
      tabIndex="-1"
    >
      <Searchbar
        onSubmit={handleSubmit}
        onChange={handleChange}
        value={lookingValue}
      />
      <ImageGallery>
        <ImageGalleryItem
          pictures={pictures}
          onClick={handleModalOpenClose}
        />
      </ImageGallery>
      {isLoading && <Loader color="#3f51b5" />}
      <Button
        pictures={pictures}
        onClick={handleLoadMore}
        isLoading={isLoading}
      />
      <Modal
        isModalOpen={isModalOpen}
        bigPicture={bigPicture}
        onClick={handleModalOpenClose}
      />
    </div>
  );
}

export default App;