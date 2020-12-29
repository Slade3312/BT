import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { setCaretPosition, getCaretPosition, pasteHtmlAtCaret } from 'utils/dom-helpers';
import { messageUrlRegExp } from 'utils/regexps';
import { OverlayLoader } from 'components/common/Loaders/components';
import {
  composeAxiosPostRequest,
} from 'requests/helpers';
import { ImgNode, GhostHtml } from './components';


import { getMappedExistingLinks, convertHtmlWithImgTagsToLinksString, processSpacesAndLinebreaks } from './utils';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const config = {
  characterData: true,
  subtree: true,
  attributes: true,
  childList: true,
};

/* idea: we have two divs, one of them is like 'editable text area' - special HTML element, and second - ghost block
    editable text area - in charge of dangerouslyHtml and innerHTML to read it and update ghost block
    ghost text area - in charge of dangerouslyGhostHtml, when we update this prop => we confirm new visual tags
      and render them (but don't update dangerouslyHtml)
 */
class ContentEditableLinks extends React.Component {
  constructor(props) {
    super(props);
    this.componentRef = React.createRef(null);
    this.ghostRef = React.createRef(null);

    this.observer = React.createRef(null);

    this.state = {
      // we will update this value in all situations when we want to convert all new links to visual tags
      dangerouslyHtml: '',
      // we will update this value every time when original value has changed (full sync)
      dangerouslyGhostHtml: '',
      isLoading: false,
    };

    // to save current value state for drag & drop effect
    this._dragSavedValue = {};
  }

  componentDidMount() {
    this.updateOriginalHtml();
    this.updateGhostHtml();

    // TODO: maybe we can short count of calls, but can be aware about cross browsers support
    // onInput callback don't work in IE
    this.observer = new MutationObserver(() => {
      this.handleChange();
    });

    requestAnimationFrame(() => {
      // hang on observe after first update, it's important to correct onChange calling (excludes on component mount)
      this.observer.observe(this.componentRef.current, config);
    });

    this.componentRef.current.addEventListener('paste', (e) => {
      // Stop data actually being pasted into div
      e.stopPropagation();
      e.preventDefault();

      // Get pasted data via clipboard API
      const clipboardData = e.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData('Text');

      const caretPos = getCaretPosition(this.componentRef.current);

      pasteHtmlAtCaret(` ${pastedData} `);

      requestAnimationFrame(() => {
        this.updateOriginalHtml();
        this.updateGhostHtml();
        setCaretPosition(this.componentRef.current, caretPos);
      });
    });
  }

  componentDidUpdate(prevProps) {
    const prevTextValue = prevProps.value?.text;
    const currentTextValue = this.props.value?.text;

    /* to correct first init of existing value */
    if (prevTextValue === undefined && (currentTextValue !== prevTextValue)) {
      this.updateOriginalHtml();
      this.updateGhostHtml();
    }
  }

  // to make width like in original content (if we see scrollbar)
  updateGhostNodeWidth = () => {
    this.ghostRef.current.style.maxWidth = `${this.componentRef.current.clientWidth + 2}px`;
  };

  // to scroll ghost node together original node
  handleScroll = (e) => {
    if (this.ghostRef.current) {
      this.ghostRef.current.style.transform = `translateY(${-e.target.scrollTop}px)`;
    }
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();

      pasteHtmlAtCaret('<br>');
      return false;
    }
    return true;
  };

  handleChange = () => {
    const nextTextValue = convertHtmlWithImgTagsToLinksString(this.getNodeHTML());
    const links = getMappedExistingLinks(nextTextValue, this.getActualLinksValue());
    this.props.onChange({
      text: nextTextValue || '',
      links,
    });

    this.updateGhostHtml();
    this.updateGhostNodeWidth();
  };

  updateLinkByName = ({ name, shortLink }, flag) => {
    const mappedLinks = getMappedExistingLinks(this.getActualTextValue(), this.getActualLinksValue(), shortLink);
    const result = {
      text: this.getActualTextValue(),
      links: mappedLinks.map((data) => {
        if (data.link === name) {
          return { link: name, isShort: flag, shortLink };
        }
        return data;
      }),
    };
    this.props.onChange(result);
  };

  handleSwitchToShortLink = async (linkName) => {
    const pseudoLink = await composeAxiosPostRequest({
      url: '/api/v1/client/campaigns/get_short_link/',
      data: {
        link: linkName,
      },
    });
    const shortLink = pseudoLink.shortURL;
    this.updateLinkByName({ name: linkName, shortLink }, true);
  };

  handleResetShortLink = (linkName) => {
    this.updateLinkByName({ name: linkName }, false);
  };

  handleRemoveLink = (linkIndex) => {
    let foundUrlIndex = -1;
    // work with original react field value to avoid bugs
    this.props.onChange({
      text: this.getActualTextValue().replace(messageUrlRegExp, (tag) => {
        foundUrlIndex += 1;
        if (foundUrlIndex === linkIndex) return '';
        return tag;
      }),
      links: this.getActualLinksValue(),
    });
    this.setState({}, () => {
      this.updateOriginalHtml();
      this.updateGhostHtml();
    });
  };

  getActualTextValue = () => (this.props.value && this.props.value.text) || '';
  getActualLinksValue = () => (this.props.value && this.props.value.links) || [];

  getNodeHTML = () => (this.componentRef.current && this.componentRef.current.innerHTML) || '';

  handleBlur = () => {
    this.handleChange();
    this.updateOriginalHtml();
    this.updateGhostHtml();
    this.props.onBlur();
  };

  handleDrop = (e) => {
    // to restore value after drag and drop
    requestAnimationFrame(() => {
      const caretPos = getCaretPosition(this.componentRef.current);
      this.updateOriginalHtml();
      this.updateGhostHtml();
      // to fix spaces between putted link right after drop event
      this.props.onChange(this._dragSavedValue, e);
      setCaretPosition(this.componentRef.current, caretPos + 2);
    });
  };

  handleDragStart = () => {
    this._dragSavedValue = { ...this.props.value };
  };

  // for firefox and IE, when we settle selection and press backspace and after length of our string is 0, then
  // all other callbacks don't fired (even observer)
  handleKeyUp = () => {
    this.handleChange();
  };

  getConvertedTemplateByActualValue = () =>
    this.getActualTextValue().replace(messageUrlRegExp, url => new ImgNode({ url }).render());

  updateOriginalHtml = () => {
    const converted = this.getConvertedTemplateByActualValue();

    this.setState({ dangerouslyHtml: converted });
    // despite the fact that dangerouslySetInnerHTML will be updated by react
    // sometimes it will not happen if we exec onBlur on settle previous content again
    // as example (remove link str and write the link str again => after on blur we've not seen update
    this.componentRef.current.innerHTML = converted;
  };

  updateGhostHtml = () => {
    this.setState({
      dangerouslyGhostHtml: this.componentRef.current.innerHTML,
    });
  };

  render() {
    return (
      <OverlayLoader isLoading={this.state.isLoading}>
        <div className={cx('component')} name={this.props.name}>
          {this.props.placeholder && !this.getActualTextValue() && (
            <div className={cx('placeholder')}>{this.props.placeholder}</div>
          )}

          <div
            ref={this.componentRef}
            onKeyDown={this.handleKeyDown}
            onKeyUp={this.handleKeyUp}
            onBlur={this.handleBlur}
            onDrop={this.handleDrop}
            onDragStart={this.handleDragStart}
            onScroll={this.handleScroll}
            className={cx('container')}
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: this.state.dangerouslyHtml }}
          />

          <div ref={this.ghostRef} className={cx('ghost')}>
            <GhostHtml
              links={this.getActualLinksValue()}
              onSwitchToShortLink={this.handleSwitchToShortLink}
              onResetShortLink={this.handleResetShortLink}
              onRemoveLink={this.handleRemoveLink}
              template={processSpacesAndLinebreaks(this.state.dangerouslyGhostHtml)}
            />
          </div>
        </div>
      </OverlayLoader>
    );
  }
}

ContentEditableLinks.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  links: PropTypes.array,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.shape({
    text: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.shape({
      link: PropTypes.string,
      isShort: PropTypes.bool,
    })),
  }),
};

export default ContentEditableLinks;
