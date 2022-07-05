import { Component } from 'react';
import styles from 'styles/App.module.css';
import { Searchbar } from 'components/Searchbar';
import { ImageGallery } from 'components/ImageGallery';
import { ImageGalleryItem } from 'components/ImageGalleryItem';
import { finderInstance } from 'api/client';
import { Button } from 'components/Button';
import { Modal } from 'components/Modal';
import { Loader } from 'components/Loader';


class App extends Component {
  static defaultProps = {};

  static propTypes = {};

  state = {
    pictures: [],
    bigPicture: [],
    isLoading: false,
    error: null,

    lookingValue: '',
    page: 1,

    isModalOpen: false,
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({ lookingValue: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      const response = await finderInstance.get(
        `?q=${this.state.lookingValue}&key=26610249-d0ecba3c93167ffebf2a906f0&page=${this.state.page}&image_type=photo&orientation=horizontal&per_page=12`
      );
      this.setState({ pictures: response.data.hits, page: 2 });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleLoadMore = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });
    try {
      const response = await finderInstance.get(
        `?q=${this.state.lookingValue}&page=${this.state.page}&key=26610249-d0ecba3c93167ffebf2a906f0&image_type=photo&orientation=horizontal&per_page=12`
      );
      this.setState(prevState => ({
        pictures: [...prevState.pictures, ...response.data.hits],
      }));
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
    this.setState(prevState => {
      return { page: prevState.page + 1 };
    });
  };

  handleModalOpenClose = (id) => {
    if (this.state.isModalOpen) {
      this.setState({ isModalOpen: false });
    } else {
      this.setState({ isModalOpen: true });
    }

    const uniqueBigPicture = this.state.pictures.find(
      picture => picture.id === id
    );
    this.setState({ bigPicture: uniqueBigPicture });
  };

  handleModalCloseByKey = (event) => { 
  if (event.key === 'Escape' && this.state.isModalOpen) {
    this.setState({ isModalOpen: false });
  }
  };

  render() {
    const { pictures, lookingValue, isLoading } = this.state;
    return (
      <div
        className={styles.App}
        onKeyDown={this.handleModalCloseByKey}
        tabIndex="-1"
      >
        <Searchbar
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
          value={lookingValue}
        />

        <ImageGallery>
          <ImageGalleryItem
            pictures={pictures}
            onClick={this.handleModalOpenClose}
          />
        </ImageGallery>
        {isLoading && <Loader color="#3f51b5" />}
        <Button
          pictures={pictures}
          onClick={this.handleLoadMore}
          isLoading={isLoading}
        />
        <Modal
          isModalOpen={this.state.isModalOpen}
          bigPicture={this.state.bigPicture}
          onClick={this.handleModalOpenClose}
        />
      </div>
    );
  }
}


export default App;