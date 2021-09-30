/** @jsx jsx */
import React, {useContext, ReactElement, useState, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {BsSearch, BsQuestionSquare} from 'react-icons/bs';
import {FaTimes} from 'react-icons/fa';

import {Heading} from '../components/Heading';
import {TranslucentRectangle} from '../components/TranslucentRectangle';
import {ScrollToTopButton} from '../components/ScrollToTopButton';

import {fadeIn} from '../utils/animation';
import {theme} from '../utils/theme';
import {
  IInfoContext,
  InfoContext,
  ISetTransparentCtx,
  SetTransparentCtx,
} from '../utils/contexts';
import {FAQ as FAQInterface} from '../utils/interfaces';

// Interfaces --
export interface FAQProp {
  question: string;
  answer: string;
  extraStyling?: SxStyleProp;
}

export interface QuestionProp {
  question: string;
  loadHandler: () => void;
  extraStyling?: SxStyleProp;
  imageExtraStyling?: SxStyleProp; // for scaling
}

export interface ResponseProp {
  response: string;
  textExtraStyling?: SxStyleProp;
  rectExtraStyling?: SxStyleProp;
}

//=====================================================================
// To hold the speech bubble and question
const QuestionItem: React.FC<QuestionProp> = ({
  question,
  loadHandler,
  extraStyling,
  imageExtraStyling,
}): ReactElement => {
  // Yay more styles!!
  const outerContainerDiv: SxStyleProp = {
    // 'Holds' the inner wrapper, and behaves like a top margin
    width: '100%',

    ...extraStyling,
  };
  const innerWrapperDiv: SxStyleProp = {
    top: '3.5em',
    maxWidth: '95vw', // to make sure the page doesn't scroll to the right
    position: 'relative',
    display: 'inline-block',
    textAlign: 'center',

    ...extraStyling,
  };
  const textWrapperDiv: SxStyleProp = {
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  const titleTextStyle: SxStyleProp = {
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.heading,
    color: theme.colors.text.darkGray,
    wordWrap: 'normal',
    textAlign: 'center',
    margin: 'auto',
  };
  const imageStyle = {
    maxWidth: '90vw',
    display: 'inline-block',
    ...imageExtraStyling,
  };

  return (
    <div sx={outerContainerDiv}>
      <div sx={innerWrapperDiv}>
        <img
          src="./assets/speech_bubble.svg"
          alt=""
          sx={imageStyle}
          onLoad={loadHandler}
        />
        <div sx={textWrapperDiv}>
          <p sx={titleTextStyle}>{question}</p>
        </div>
      </div>
    </div>
  );
};

//=====================================================================
// ResponseItem holds the response div and rect
const ResponseItem: React.FC<ResponseProp> = ({
  response,
  textExtraStyling,
  rectExtraStyling,
}): ReactElement => {
  const textWrapperDiv: SxStyleProp = {
    position: 'relative',
    display: 'inline-block',

    // TODO: mt is based off width which i find extremely stupid so
    // fix this and make it better
    // to push the wrapper down a bit and make description text readable
    mt: ['20%', '15%', '10%'],
    width: '90%',
  };
  const responseTextStyle: SxStyleProp = {
    position: 'relative',

    color: theme.colors.text.darkSlate,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.body,
    wordWrap: 'normal',
    lineHeight: 1.6,
  };
  const rectStyling: SxStyleProp = {
    minHeight: ['25vh', '30vh', '40vh'],

    ...textExtraStyling,
    ...rectExtraStyling,
  };

  return (
    // yes shari i know the rectangles aren't EXACTLY the way it is on
    // the planning xd but this is good enoughhh. it serves its purpose
    // and i can reuse it!!
    <TranslucentRectangle lengthX="60em" extraStyling={rectStyling}>
      <div sx={textWrapperDiv}>
        <p sx={{...responseTextStyle, ...textExtraStyling}}>{response}</p>
      </div>
    </TranslucentRectangle>
  );
};

//=====================================================================

interface FAQItemProps {
  faqQuestion: FAQInterface;
  questionNumber: number;
}

const FAQItem: React.FC<FAQItemProps> = ({
  faqQuestion,
  questionNumber,
}): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  let styling: SxStyleProp;
  let imageStyling: SxStyleProp | undefined;

  if (questionNumber % 2 === 0) {
    // Left side of the page
    styling = {
      ml: 0,
      mr: 'auto',
      textAlign: 'left',
      left: '5%',
    };
  } else {
    // Right side of the page
    styling = {
      ml: 'auto',
      mr: 0,
      textAlign: 'right',
      right: '5%',
    };
    // For flipping the image
    imageStyling = {transform: 'scaleX(-1)'};
  }

  // Styling the funky transparent rectangle
  const rectStyling: SxStyleProp = {
    maxWidth: '95vw',
    backgroundColor:
      questionNumber % 3 === 0
        ? theme.colors.background.faqOverlay
        : 'transparent',
  };
  const wrapperDiv = {
    width: '100%',

    '@keyframes fade-in': fadeIn,
    animation: isLoading ? 'none' : 'fade-in .2s linear',
    display: isLoading ? 'none' : 'block',
  };

  /**
   * Handles an image's load event by setting isLoading to false.
   */
  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <li key={questionNumber} sx={{mb: '-2em'}}>
      <div sx={wrapperDiv}>
        <QuestionItem
          question={faqQuestion.question}
          loadHandler={handleLoad}
          extraStyling={styling}
          imageExtraStyling={imageStyling}
        />
        <ResponseItem
          response={faqQuestion.answer}
          textExtraStyling={styling}
          rectExtraStyling={rectStyling}
        />
      </div>
    </li>
  );
};

//=====================================================================

interface FAQcategoryItemProps {
  faqQuestions: FAQInterface[];
  category: string;
  extraWrapperStyling?: SxStyleProp;
}

const FAQcategoryItem: React.FC<FAQcategoryItemProps> = ({
  faqQuestions,
  category,
  extraWrapperStyling,
}) => {
  const wrapperStyle: SxStyleProp = {
    mb: '8em',
    width: '100%',

    ...extraWrapperStyling,
  };
  const headingWrapperStyle: SxStyleProp = {
    left: '5%',
    maxWidth: '90%', // to make sure the page doesn't scroll to the right
    position: 'relative',
  };

  /**
   * Retrieves and formats all the seperate question answers
   * @param faqQuestions - all questions in the faq.
   * @returns a list of ReactElements with the questions.
   */
  const getFaqItems = (faqQuestions: FAQInterface[]) => {
    if (!faqQuestions) {
      return <div></div>;
    }

    return faqQuestions.map((question, i) => {
      return <FAQItem faqQuestion={question} questionNumber={i} />;
    });
  };

  return (
    <div sx={wrapperStyle}>
      <div sx={headingWrapperStyle}>
        <Heading
          text={category}
          alignment="center"
          size="small"
          underline={false}
        />
      </div>
      <div
        sx={{
          flex: 'initial',
        }}
      >
        <ul sx={{listStyleType: 'none', px: 0, py: 0, mx: 0, my: 0}}>
          {/* // Getting the list of question-response stuff */}
          {getFaqItems(faqQuestions)}
        </ul>
      </div>
    </div>
  );
};

//=====================================================================
// FAQ -- renders the FAQ page
interface sortedFaqQuestions {
  [index: string]: FAQInterface[];
}

const sortIntoFAQCategories = (allFaq: FAQInterface[]): sortedFaqQuestions => {
  const sortedQuestions = {};

  // actually sort the questions
  allFaq.forEach((question) => {
    if (sortedQuestions.hasOwnProperty(question.category)) {
      sortedQuestions[question.category].push(question);
    } else {
      sortedQuestions[question.category] = [question];
    }
  });

  return sortedQuestions;
};

export const FAQ: React.FC = (): ReactElement => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // is this bad memory usage? idk man lol
  const allFaqQuestions = useContext<IInfoContext>(InfoContext).faq;
  const sortedFaqQuestions: sortedFaqQuestions = sortIntoFAQCategories(
    allFaqQuestions,
  );

  const {setTransparent} = useContext<ISetTransparentCtx>(SetTransparentCtx);
  useEffect(() => setTransparent(false), []);

  // Styles -----------------------------------------------------------
  const wrapperStyle: SxStyleProp = {
    // the main page div

    width: '100%',
    minHeight: '100vh',
    backgroundColor: theme.colors.beige,
  };
  const innerWrapperStyle: SxStyleProp = {
    // the div that contains everything

    top: '20vh',
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    mb: '6em', // push away footer
  };
  const headerWrapperStyle: SxStyleProp = {
    // the header div

    left: '5%',
    mb: '3em',
    maxWidth: '90%', // to make sure the page doesn't scroll to the right

    position: 'relative',
    display: 'flex',
    flexDirection: ['column', 'row'],
  };
  const headingStyle: SxStyleProp = {
    width: ['100%', '50%'],
    mb: ['1em', 0],
  };

  // this is just the clubs search box but touched up a bit lol
  // thanks shari
  const searchBoxStyle: SxStyleProp = {
    height: '1.3em',
    borderRadius: 15,
    borderColor: theme.colors.navbar,
    borderWidth: 1,

    width: '100%',
    py: '1em',
    px: '0.5em',
    mr: 0,
    ml: 'auto',

    fontFamily: theme.fonts.body,
    '&:focus': {
      borderWidth: 1.5,
      outline: 'none',
    },
  };
  const searchBoxWrapperStyle: SxStyleProp = {
    position: 'relative',
    width: ['100%', '50%', '40%'],
    my: 'auto',
    ml: 'auto',
    mr: 0,
    fontSize: theme.fontSizes.bodySmall.map((n) => n + 5),
  };
  const iconStyle: SxStyleProp = {
    position: 'absolute',
    right: '0.5em',
    top: '0.5em',
    '&:hover': {
      cursor: 'pointer',
    },
  };

  // Functions --------------------------------------------------------
  /**
   * Returns a formatted list of faq category items using the
   * questions' categories.
   * @param sortedFaqQuestions - The object with sorted faq questions.
   */
  const getAllFaqCategories = (sortedFaqQuestions: sortedFaqQuestions) => {
    /*
    Sort the names of the categories, and if it's other, make sure its
    the last one. Otherwise, sort based on reverse alphanumeric value.
    Then, use each category name to map the list of property names into
    FAQ category items, and we're good.
    */
    const other = 'other'; // if you change other name, change this

    return Object.keys(sortedFaqQuestions)
      .sort((a, b) => (a === other ? 1 : b === other ? -1 : a.localeCompare(b)))
      .map((category) => {
        return (
          <FAQcategoryItem
            key={category}
            faqQuestions={sortedFaqQuestions[category]}
            category={category.toUpperCase()}
          />
        );
      });
  };

  // Querying ---------------------------------------------------------
  /**
   * Searches every question and keywords for a certain query and
   * returns any that have the query in the question or keywords, or is
   * part of the category being searched for.
   * @param query - The string to be searched for.
   */
  const getSearchResults = (query: string) => {
    return allFaqQuestions.filter((question) => {
      if (!question.question) return false;

      return (
        question.question.toLowerCase().includes(query.toLowerCase()) ||
        question.category.toLowerCase().includes(query.toLowerCase()) ||
        (question.keywords &&
          question.keywords.toLowerCase().includes(query.toLowerCase()))
      );
    });
  };

  /**
   * Fetches and displays all relevant questions that either have
   * the query string in the title, is part of a category that
   * has the query string in it, or has keywords that include the
   * query string.
   * @param query - The string to be searched for.
   */
  const displaySearchResults = (query: string) => {
    const questions = getSearchResults(query);

    return (
      <FAQcategoryItem
        faqQuestions={questions}
        category={questions.length > 0 ? 'SEARCH RESULTS' : 'NO RESULTS FOUND'}
        extraWrapperStyling={{mb: '10em'}}
      />
    );
  };
  // The return code --------------------------------------------------
  return (
    <div sx={wrapperStyle}>
      {/* initializing scroll to top button */}
      <ScrollToTopButton />

      {/* the faq */}
      <div sx={innerWrapperStyle}>
        <div sx={headerWrapperStyle}>
          <div sx={headingStyle}>
            <Heading
              text="FAQ"
              alignment="left"
              extraStyling={{width: ['100%', '200%']}}
            />
          </div>

          <div sx={searchBoxWrapperStyle}>
            <input
              sx={searchBoxStyle}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Question Keywords"
            />
            {searchQuery === '' ? (
              <BsSearch sx={iconStyle} />
            ) : (
              <FaTimes sx={iconStyle} onClick={() => setSearchQuery('')} />
            )}
          </div>
        </div>

        {searchQuery === ''
          ? getAllFaqCategories(sortedFaqQuestions)
          : displaySearchResults(searchQuery)}
      </div>
    </div>
  );
};
