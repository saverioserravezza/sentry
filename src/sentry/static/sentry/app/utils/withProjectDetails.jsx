import PropTypes from 'prop-types';
import React from 'react';
import Reflux from 'reflux';
import createReactClass from 'create-react-class';

import ProjectsStore from 'app/stores/projectsStore';
import SentryTypes from 'app/sentryTypes';
import getDisplayName from 'app/utils/getDisplayName';
import withApi from 'app/utils/withApi';
import withProjects from 'app/utils/withProjects';

class ProgressiveProjectDetails extends React.Component {
  static propTypes = {
    slugs: PropTypes.arrayOf(PropTypes.string),
  };

  componentDidMount() {}

  componentDidUpdate() {}

  fetchQueue = new Set();

  getDetails() {
    const {projects} = this.props;

    // check if projects store has any items, if not we should wait
    if (!projects.length) {
      return;
    }

    // Otherwise, check `projects` (from store)
    const projectsFromStore = slugs.map(
      slug => projects.find(project => project.slug === slug) || slug
    );

    this.setState({
      projectsFromStore,
    });

    projectsWithDetails
      .filter(project => typeof project === 'string')
      .forEach(slug => this.fetchQueue.add(slug));

    this.fetchDetails();
  }

  getDetailsFromStore() {}

  async fetchDetails() {
    const {api, orgId} = this.props;

    if (!this.fetchQueue.size()) {
      return;
    }

    this.setState({
      fetching: true,
    });

    const promises = Array.from(this.fetchQueue).map(project =>
      fetchProject(api, orgId, project)
    );
    const results = await Promises.all(promises);
    this.setState({
      fetchedProjects: results,
      fetching: false,
    });
  }

  render() {
    const {children} = this.props;
    return children({
      projects: [...this.state.fetchedProjects, ...this.state.projectsFromStore],
      fetching: this.state.fetching,
    });
  }
}

export default withProjects(withApi(ProgressiveProjectDetails));

/**
 * Higher order component that uses ProjectsStore and provides a list of projects
 */
// const withProjectDetails = WrappedComponent =>
// withProjects(createReactClass({
// displayName: `withProjectDetails(${getDisplayName(WrappedComponent)})`,
// propTypes: {
// organization: SentryTypes.Organization,
// project: SentryTypes.Project,
// },
// mixins: [Reflux.listenTo(ProjectsStore, 'onProjectUpdate')],
// getInitialState() {
// return {
// projects: ProjectsStore.getAll(),
// };
// },

// onProjectUpdate() {
// this.setState({
// projects: ProjectsStore.getAll(),
// });
// },
// render() {
// return <WrappedComponent {...this.props} projects={this.state.projects} />;
// },
// }));

// export default withProjectDetails;
