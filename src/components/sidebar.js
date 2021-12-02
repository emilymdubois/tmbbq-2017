import React from 'react';
import { connect } from 'react-redux';
import ControlSelect from '@mapbox/react-control-select';
import ControlText from '@mapbox/react-control-text';
import _ from 'lodash';
import { setActiveId, setValidIds } from '../redux/action_creators';
import data from '../data';

import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

let Sidebar = class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeId: null,
      rating: [4, 5],
      opened: [1900, 2016],
      pitmasterAge: [23, 82],
      open: 'any',
      method: 'any',
      scrollTo: false,
      searchText: ''
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (this.state.activeId !== nextProps.activeId) {
      this.setState({ activeId: nextProps.activeId, scrollTo: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.activeCard && this.state.scrollTo) this.activeCard.scrollIntoView();

    const prevStateControls = _.pick(prevState, ['rating', 'opened', 'pitmasterAge', 'open', 'method', 'searchText']);
    const stateControls = _.pick(this.state, ['rating', 'opened', 'pitmasterAge', 'open', 'method', 'searchText']);
    if (!_.isEqual(prevStateControls, stateControls)) {
      const validIds = this.filterByControls().map(f => f.properties.id);
      this.props.setValidIds(validIds);
    }
  }

  changeRatingRange = rating => {
    this.setState({ rating });
  }

  changeOpenedRange = opened => {
    this.setState({ opened });
  }

  changePitmasterAgeRange = pitmasterAge => {
    this.setState({ pitmasterAge });
  }

  changeOpen = open => {
    this.setState({ open });
  }

  changeMethod = method => {
    this.setState({ method });
  }

  changeSearch = searchText => {
    this.setState({ searchText })
  }

  renderControls = () => {
    const ratingRange = this.state.rating[0] === this.state.rating[1] ? this.state.rating[0] : `${this.state.rating[0]} to ${this.state.rating[1]}`;
    const openedRange = this.state.opened[0] === this.state.opened[1] ? this.state.opened[0] : `${this.state.opened[0]} to ${this.state.opened[1]}`;
    const pitmasterAgeRange = this.state.pitmasterAge[0] === this.state.pitmasterAge[1] ? this.state.pitmasterAge[0] : `${this.state.pitmasterAge[0]} to ${this.state.pitmasterAge[1]}`;

    return (
      <div>
        <div><span className="txt-bold">Rating</span>: {ratingRange}</div>
        <div className="px6"><Range onChange={this.changeRatingRange} min={4} max={5} step={0.25} defaultValue={[4, 5]} trackStyle={[{ backgroundColor: '#333f48' }]} handleStyle={[{ borderColor: '#333f48', boxShadow: '0 0 0px' }, { borderColor: '#333f48', boxShadow: '0 0 0px' }]} /></div>
        <div className="mt12"><span className="txt-bold">Established</span>: {openedRange}</div>
        <div className="px6"><Range onChange={this.changeOpenedRange} min={1900} max={2016} step={1} defaultValue={[1900, 2016]} trackStyle={[{ backgroundColor: '#333f48' }]} handleStyle={[{ borderColor: '#333f48', boxShadow: '0 0 0px' }, { borderColor: '#333f48', boxShadow: '0 0 0px' }]} /></div>
        <div className="mt12"><span className="txt-bold">Pitmaster age</span>: {pitmasterAgeRange}</div>
        <div className="px6"><Range onChange={this.changePitmasterAgeRange} min={23} max={82} step={1} defaultValue={[23, 82]} trackStyle={[{ backgroundColor: '#333f48' }]} handleStyle={[{ borderColor: '#333f48', boxShadow: '0 0 0px' }, { borderColor: '#333f48', boxShadow: '0 0 0px' }]} /></div>
        <div className="grid grid--gut12 mt12">
          <div className="col col--6 txt-bold">Open</div>
          <div className="col col--6 txt-bold">Method</div>
          <div className="col col--6"><ControlSelect id='open' value={this.state.open} onChange={this.changeOpen} options={[{ label: 'Any', value: 'any' }, { label: 'Monday', value: 'monday' }, { label: 'Tuesday', value: 'tuesday' }, { label: 'Wednesday', value: 'wednesday' }, { label: 'Thursday', value: 'thursday' }, { label: 'Friday', value: 'friday' }, { label: 'Saturday', value: 'saturday' }, { label: 'Sunday', value: 'sunday' }]} themeControlSelect='py6 txt-s select--s select select--stroke select--stroke-gray-dark flex-child--grow' themeControlSelectContainer='w-full'/></div>
          <div className="col col--6"><ControlSelect id='method' value={this.state.method} onChange={this.changeMethod} options={[{ label: 'Any', value: 'any' }, { label: 'Oak', value: 'oak' }, { label: 'Mesquite', value: 'mesquite'}, { label: 'Pecan', value: 'pecan' }, { label: 'Hickory', value: 'hickory' }, { label: 'Pit', value: 'pit' }, { label: 'Smoker', value: 'smoker' }, { label: 'Rotisserie', value: 'rotisserie' }]} themeControlSelect='py6 txt-s select--s select select--stroke select--stroke-gray-dark flex-child--grow' themeControlSelectContainer='w-full'/></div>
        </div>
        <div className="mt12 txt-bold">Search</div>
        <ControlText id="search" value={this.state.searchText} onChange={this.changeSearch} themeControlInput="w-full py6 txt-s select--s select select--stroke"/>
      </div>
    )
  }

  openCard = card => {
    this.setState({ activeId: card.properties.id, scrollTo: false });
    this.props.setActiveId(card.properties.id);
  }

  filterByControls = () => {
    return data.features.filter(feature => {
      const { properties } = feature;
      const matchesRating = properties.rating >= this.state.rating[0] && properties.rating <= this.state.rating[1];
      const matchesOpened = properties.opened >= this.state.opened[0] && properties.opened <= this.state.opened[1];
      const matchesPitmastersAge = properties.pitmasters.filter(p => {
        return p.age >= this.state.pitmasterAge[0] && p.age <= this.state.pitmasterAge[1];
      }).length;
      const matchesOpen = this.state.open !== 'any' && !properties[`${this.state.open}_hours`] ? false : true;
      const matchesMethod = this.state.method !== 'any' && !new RegExp(this.state.method, 'i').test(properties.method) ? false : true;
      const matchesSearch = new RegExp(this.state.searchText, 'i').test(JSON.stringify(properties));
      return matchesRating && matchesOpened && matchesPitmastersAge && matchesOpen && matchesMethod && matchesSearch;
    });
  }

  renderDisplayCards = () => {
    const filtered = this.filterByControls();
    const features = filtered.map((feature, i) => {
      const { properties } = feature;
      const onCardClick = this.openCard.bind(this, feature);
      const refActiveCard = el => { this.activeCard = el; };
      const activeCard = this.state.activeId === properties.id;
      const pitmasters = properties.pitmasters.map(p => { return `${p.name}, ${p.age}` }).join('; ');

      let wrapperClasses = 'mb12';
      wrapperClasses += activeCard ? ' color-white' : '';

      let headerClasses = 'px12 py12';
      headerClasses += activeCard ? ' bg-texas-orange round-t' : ' bg-gray-faint round';

      return (
        <div key={`feature-${i}`} className={wrapperClasses}>
          <div ref={activeCard && refActiveCard} key={properties.id} className={headerClasses}>
            <button className="w-full txt txt-m" onClick={onCardClick}>
              <div className="flex-parent flex-parent--space-between-main txt-bold">
                <div className="flex-child">{properties.name}</div>
                {properties.rank && <div className="flex-child">#{properties.rank}</div>}
              </div>
              {properties.location.town}
            </button>
          </div>
          {activeCard &&
            <div>
              <div className="txt-s px12 py12 mb12 bg-texas-blue round-b">
                <div className="grid grid--gut12">
                  <div className="col col--4 txt-bold">Rating</div>
                  <div className="col col--8">{properties.rating} out of 5</div>
                  <div className="col col--4 txt-bold">Opened</div>
                  <div className="col col--8">{properties.opened}</div>
                  <div className="col col--4 txt-bold">Pitmasters</div>
                  <div className="col col--8">{pitmasters}</div>
                  <div className="col col--4 txt-bold">Method</div>
                  <div className="col col--8">{properties.method}</div>
                  <div className="col col--4 txt-bold">Pro tip</div>
                  <div className="col col--8">{properties.pro_tip}</div>
                  <div className="col col--4 txt-bold">Address</div>
                  <div className="col col--8">{properties.location.address}</div>
                  <div className="col col--4 txt-bold">Phone</div>
                  <div className="col col--8">{properties.phone}</div>
                  <div className="col col--4 txt-bold">Monday</div>
                  <div className="col col--8">{properties.monday_hours || 'Closed'}</div>
                  <div className="col col--4 txt-bold">Tuesday</div>
                  <div className="col col--8">{properties.tuesday_hours || 'Closed'}</div>
                  <div className="col col--4 txt-bold">Wednesday</div>
                  <div className="col col--8">{properties.wednesday_hours || 'Closed'}</div>
                  <div className="col col--4 txt-bold">Thursday</div>
                  <div className="col col--8">{properties.thursday_hours || 'Closed'}</div>
                  <div className="col col--4 txt-bold">Friday</div>
                  <div className="col col--8">{properties.friday_hours || 'Closed'}</div>
                  <div className="col col--4 txt-bold">Saturday</div>
                  <div className="col col--8">{properties.saturday_hours || 'Closed'}</div>
                  <div className="col col--4 txt-bold">Sunday</div>
                  <div className="col col--8">{properties.sunday_hours || 'Closed'}</div>
                </div>
              </div>
            </div>
          }
        </div>
      )
    });
    return (
      <div>
        {features}
      </div>
    )
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes}>
          <div className="px18 py18 bg-texas-blue color-white">
            <div className="title txt-h3">TMBBQ 2017</div>
            <div className="txt-h5 mt12">Explore the top 50 barbecue joints in Texas. Data from <a href="https://www.texasmonthly.com/food/the-list-the-top-50-barbecue-joints-in-texas/" target="_blank" rel="noopener noreferrer"><span className="txt-underline">Texas Monthly</span></a>, 2017.</div>
          </div>
          <div className="px18 py18">
            {this.renderControls()}
          </div>
          <div className="px18 py18 border-t border--gray-light scroll-styled scroll-auto">
            {this.renderDisplayCards()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    activeId: state.activeId
  };
}

const mapDispatchToProps = {
  setActiveId,
  setValidIds
}

Sidebar = connect(mapStateToProps, mapDispatchToProps)(Sidebar);

export { Sidebar };
