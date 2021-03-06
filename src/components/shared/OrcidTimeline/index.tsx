import React from "react";
import { Orcid } from "../../../types/orcid";
import { Chrono } from "react-chrono";
import MyStringUtils from "../../../utils/MyStringUtils";

interface Props {
  orcidSequence:
  | Orcid.Educations
  | Orcid.Employments
  | Orcid.Works;
  mode?: "VERTICAL" | "VERTICAL_ALTERNATING" | "HORIZONTAL"
  // allows to pass through custom component to be displayed as TimelineEntry
  // gets data passed through via props
  CardComp?: React.FC<{ data: TimelineEntry }>
}

export interface TimelineEntry {
  title: string;
  cardTitle?: string;
  cardSubtitle?: string;
  cardDetailedText?: string;
  // original datapoint provided by ORCID
  orcidData?: | Orcid.EducationSummary
  | Orcid.EmploymentSummary
  | Orcid.WorkSummary;
}

/**
 * Handles conversion of data to correct model of used Timeline component
 * @returns
 */
const OrcidTimeline: React.FC<Props> = (props) => {
  
  /**
   * Handles type casting -- calls correct transformer methods for given Orcid sequence-data.  
   * @param propData
   * @returns
   */
  const transformData = (propData: Props): TimelineEntry[] => {
    if (propData.orcidSequence["education-summary"]) {
      let eduSequence = propData.orcidSequence as Orcid.Educations;
      return handleEduData(eduSequence);
    } else if (propData.orcidSequence["employment-summary"]) {
      let emplSequence = propData.orcidSequence as Orcid.Employments;
      return handleEmplData(emplSequence);
    } else if (propData.orcidSequence["group"]) {
      let workSequence = propData.orcidSequence as Orcid.Works;
      return handleWorksData(workSequence);
    } else {
      return [
        {
          title: "DATA MODEL NOT IMPLEMENTED, SRY X-)",
        },
      ];
    }

    //(propData.orcidSequence as Orcid.Fundings).;
  };

  const handleEduData = (eduSequence: Orcid.Educations): TimelineEntry[] => {
    return eduSequence["education-summary"].map((edu) => {
      return {
        title: MyStringUtils.catchToString(() => "Finished: " + edu["end-date"].year.value.toString()),
        cardTitle: edu["role-title"],
        cardSubtitle: edu.organization.name,
        cardDetailedText: edu.organization["disambiguated-organization"]["disambiguated-organization-identifier"],
        orcidData: edu
      };
    });
  };

  const handleEmplData = (emplSequence: Orcid.Employments): TimelineEntry[] => {
    return emplSequence["employment-summary"].map(empl => {
      return {
        title: MyStringUtils.catchToString(() => "From: " + empl["start-date"].year.value.valueOf().toString()),
        cardTitle: empl["role-title"],
        cardSubtitle: empl.organization.name,
        cardDetailedText: "",
        orcidData: empl
      }
    })
  }

  /**
   * Handles transformation of data from Orcid.Works to suitable Timeline data
   * @param worksSequence 
   * @returns 
   */
  const handleWorksData = (worksSequence: Orcid.Works): TimelineEntry[] => {

    // need to reduce to simple work-summary array first
    return worksSequence.group.reduce((aggr, grp) => {
      aggr.push(grp["work-summary"][0])
      return aggr
      // then map reduced data to timeline items
    }, []).map((work: Orcid.WorkSummary) => {
      return {
        title: MyStringUtils.catchToString(() => work["publication-date"].year.value.toString()),
        cardTitle: work.title.title.value.toString(),
        cardSubtitle: work.type,
        cardDetailedText: MyStringUtils.catchToString(() => work["external-ids"]["external-id"][0]["external-id-url"].value.toString()),
        orcidData: work
      }
    })

  }

  return (
    <div>
      <Chrono
        // will render default timeline only when no CardComponent was defined as prop
        items={props.CardComp ? null : transformData(props)}
        mode={props.mode}
        theme={{ primary: "#233554", secondary: "#233554" }} 
        hideControls
        scrollable
        useReadMore={false}
      >
        {props.CardComp && transformData(props).map((dp,index) => <props.CardComp key={index} data={dp} />)}
      </Chrono>
    </div>
  );
};

export default OrcidTimeline;
