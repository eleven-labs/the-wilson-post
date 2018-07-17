import { Dict, Post, State } from 'common';
import { History } from 'history';
import * as moment from 'moment';
import 'moment/locale/fr';
import * as React from 'react';
import InfiniteCalendar from 'react-infinite-calendar';
import { connect } from 'react-redux';
import * as slug from 'slug';

import {
  requestSchedulePost,
  SchedulePostRequestAction,
} from '../actions';
import FormGroup from '../components/FormGroup';

moment.locale('fr');

interface Props {
  title?: string;
  description?: string;
  date?: number;
  history: History;
}

interface InternalState {
  title?: string;
  titleSlug?: string;
  description?: string;
  date: moment.Moment;
  focused: boolean;
}

interface DispatchProps {
  requestSchedulePost: (post: Post) => SchedulePostRequestAction;
}

const mapStateToProps = ({ posts, selectedPost }: State): State => ({
  posts,
  selectedPost,
});

const mapDispatchToProps: DispatchProps = {
  requestSchedulePost,
};

type AllProps = Readonly<State & DispatchProps & Props>;

const initialState: InternalState = {
  title: '',
  description: '',
  date: moment().add(1, 'day'),
  focused: false,
};

class Scheduler extends React.Component<AllProps, InternalState> {
  postsMapping: Dict<Post>;
  state = initialState;

  constructor(props: AllProps) {
    super(props);

    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.close = this.close.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
  }

  componentDidMount() {
    const { posts = [] } = this.props;

    this.postsMapping = posts.reduce((acc, post) => ({
      ...acc,
      [slug(post.title)]: post,
    }), {} as Dict<Post>);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      title: nextProps.title,
      titleSlug: slug(nextProps.title || '').toLowerCase(),
      description: nextProps.description,
    });
  }

  onTitleChange({ currentTarget: { value: title = '' } }: React.SyntheticEvent<HTMLInputElement>) {
    this.setState({ title, titleSlug: slug(title).toLowerCase() });
  }

  onDescriptionChange(event: React.SyntheticEvent<HTMLTextAreaElement>) {
    this.setState({ description: event.currentTarget.value });
  }

  onSaveClick(event: React.SyntheticEvent<HTMLButtonElement>) {
    console.log(event, this.state);
  }

  close() {
    this.setState(initialState);
    this.props.history.push('/');
  }

  render() {
    const { title = '', titleSlug = '', description = '' } = this.state;

    return (
      <div className="scheduler post-content container">
        <h3>Planifier un article</h3>
        <section className="form">
          <div className="form-fields">
            <div className="column">
              <FormGroup
                field="title"
                label="Titre"
                value={title}
                onChange={this.onTitleChange}
                style={{ height: 40, lineHeight: 40 }}
                info={
                  <div>{titleSlug}</div>
                }
              />

              <FormGroup
                field="description"
                label="Description"
                value={description}
                onChange={this.onDescriptionChange}
              >
                <textarea rows={5} />
              </FormGroup>
            </div>

            <div className="column">
              <FormGroup field="date" label="Date">
                <InfiniteCalendar
                  height={300}
                  width={400}
                  minDate={moment(initialState.date).toDate()}
                  locale={{
                    // tslint:disable-next-line:no-require-imports
                    locale: require('date-fns/locale/fr'),
                    headerFormat: 'dddd, D MMMM',
                    weekdays: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                    blank: 'Aucune date selectionnée',
                    todayLabel: {
                      long: 'Aujourd\'hui',
                      short: 'Auj.',
                    },
                    weekStartsOn: 1,
                  }}
                  theme={{
                    selectionColor: '#fbe300',
                    textColor: {
                      default: '#333',
                      active: '#333',
                    },
                    weekdayColor: '#fbe300',
                    headerColor: '#efd804',
                    floatingNav: {
                      background: '#efd804',
                      color: '#444',
                      chevron: '#444',
                    },
                  }}
                />
              </FormGroup>
            </div>
          </div>
          <div className="form-buttons">
            <button onClick={this.close}>Cancel</button>
            {' '}
            <button onClick={this.onSaveClick}>Save</button>
          </div>
        </section>
      </div>
    );
  }
}

export default connect<State, DispatchProps, Props>(mapStateToProps, mapDispatchToProps)(Scheduler);
