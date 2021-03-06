import React from "react";
import { Container } from "react-bootstrap";
import { Orcid } from "../../../../types/orcid";
import MyStringUtils from "../../../../utils/MyStringUtils";
import { TimelineEntry } from "../"

interface Props {
  data?: TimelineEntry
}

const OrcidWorkCard: React.FC<Props> = (props) => {
  const orcidData = props.data.orcidData as Orcid.WorkSummary;

  /**
   * Handles the generaion of correct links
   * @returns 
   */
  const renderLink = () => {
    let href = MyStringUtils.catchToString(() =>
      orcidData["external-ids"]["external-id"][0][
        "external-id-url"
      ].value.toString()
    );
    if (href) {
      return (
        <a
          rel="noopener"
          className="text-secondary float-end"
          target="_blank"
          href={href}
        >
          {href && "Visit related project page"}
        </a>
      );
    } else {
      return null;
    }
  }

  return (
    <Container style={{ position: "absolute" }}>
      <h3 className="h6 fw-bold text-light">{props.data.cardTitle}</h3>
      <p>
        {props.data.cardSubtitle
          .replace("OTHER", "SOFTWARE")
          .replace("DISSERTATION", "THESIS")}
      </p>
      <p
        className="float-start"
        style={{
          position: "relative",
          left: "-110px",
          fontWeight: 600
        }}
      >
        {props.data.title}
      </p>
      {renderLink()}
    </Container>
  );
}


export default OrcidWorkCard;