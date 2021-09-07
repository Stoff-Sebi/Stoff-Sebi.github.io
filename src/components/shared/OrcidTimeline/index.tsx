import React from "react";
import { Orcid } from "../../../types/orcid";
import { Chrono } from "react-chrono";

interface Props {
  orcidSequence:
    | Orcid.Educations
    | Orcid.Employments
    | Orcid.Fundings
    | Orcid.PeerReviews
    | Orcid.Works;
  mode?: "VERTICAL" | "VERTICAL_ALTERNATING" | "HORIZONTAL"
}

interface TimelineEntry {
  title: string;
  cardTitle?: string;
  cardSubtitle?: string;
  cardDetailedText?: string;
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
    } else if (propData.orcidSequence["group"]){
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
        title: "",
        cardTitle: edu["role-title"],
        cardSubtitle: edu.organization.name,
        cardDetailedText: edu.organization["disambiguated-organization"]["disambiguated-organization-identifier"]
      };
    });
  };

  const handleEmplData = (emplSequence: Orcid.Employments): TimelineEntry[] => {
    return emplSequence["employment-summary"].map(empl => {
      return {
        title: "From: " + empl["start-date"].year.value.valueOf().toString(),
        cardTitle: empl["role-title"],
        cardSubtitle:empl.organization.name,
        cardDetailedText: empl["department-name"]
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
        title: (work["publication-date"] && work["publication-date"].year.value.toString()),
        cardTitle: work.title.title.value.toString(),
        cardSubtitle: work.type,
        cardDetailedText:work.source["source-name"].value.toString()
      }
    })

  }

  
  return (
    <div>
      <Chrono
        items={transformData(props)}
        mode={props.mode}
        theme={{ primary: "grey", secondary: "white" }}
        hideControls
        scrollable
      />
    </div>
  );
};

export default OrcidTimeline;
