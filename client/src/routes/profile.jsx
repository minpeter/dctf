import { useState, useCallback, useEffect } from "preact/hooks";
import { memo } from "preact/compat";
import config from "../config";

import toast from "react-hot-toast";

import {
  privateProfile,
  publicProfile,
  updateAccount,
  updateEmail,
  deleteEmail,
} from "../api/profile";
import Form from "../components/form";
import {
  PublicSolvesCard,
  PrivateSolvesCard,
} from "../components/profile/solves-card";
import * as util from "../util";
import useRecaptcha, { RecaptchaLegalNotice } from "../components/recaptcha";

const SummaryCard = memo(
  ({
    name,
    score,
    division,
    divisionPlace,
    globalPlace,
    githubId,
    isPrivate,
  }) => (
    <div class="card">
      <div class="content p-4 w-80">
        <div>
          <h5
            class={`title ${isPrivate ? "privateHeader" : "publicHeader"}`}
            title={name}
          >
            {name}
          </h5>
          {githubId && (
            <a
              href={`https://github.org/team/${githubId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i
                class="fab fa-wrapper fa-github"
                style={{ fontSize: "28px" }}
              />
            </a>
          )}
        </div>
        <div class="action-bar">
          <p>
            <i class="fa fa-wrapper fa-trophy" style={{ fontSize: "28px" }} />
            {score === 0 ? "No points earned" : `${score} total points`}
          </p>
          <p>
            <i
              class="fa fa-wrapper fa-ranking-star"
              style={{ fontSize: "28px" }}
            />
            {score === 0
              ? "Unranked"
              : `${divisionPlace} in the ${division} division`}
          </p>
          <p>
            <i
              class="fa fa-wrapper fa-ranking-star"
              style={{ fontSize: "28px" }}
            />
            {score === 0 ? "Unranked" : `${globalPlace} across all teams`}
          </p>
          <p>
            <i
              class="fa fa-wrapper fa-address-book"
              style={{ fontSize: "28px" }}
            />
            {division} division
          </p>
        </div>
      </div>
    </div>
  )
);

const UpdateCard = ({
  name: oldName,
  email: oldEmail,
  divisionId: oldDivision,
  allowedDivisions,
  onUpdate,
}) => {
  const requestRecaptchaCode = useRecaptcha("setEmail");

  const [name, setName] = useState(oldName);
  const handleSetName = useCallback((e) => setName(e.target.value), []);

  const [email, setEmail] = useState(oldEmail);
  const handleSetEmail = useCallback((e) => setEmail(e.target.value), []);

  const [division, setDivision] = useState(oldDivision);
  const handleSetDivision = useCallback((e) => setDivision(e.target.value), []);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const doUpdate = useCallback(
    async (e) => {
      e.preventDefault();

      let updated = false;

      if (name !== oldName || division !== oldDivision) {
        updated = true;

        setIsButtonDisabled(true);
        const { error, data } = await updateAccount({
          name: oldName === name ? undefined : name,
          division: oldDivision === division ? undefined : division,
        });
        setIsButtonDisabled(false);

        if (error !== undefined) {
          toast.error(error);
          return;
        }

        toast.success("Profile updated");

        onUpdate({
          name: data.user.name,
          divisionId: data.user.division,
        });
      }

      if (email !== oldEmail) {
        updated = true;

        let error, data;
        if (email === "") {
          setIsButtonDisabled(true);
          ({ error, data } = await deleteEmail());
        } else {
          const recaptchaCode = await requestRecaptchaCode?.();
          setIsButtonDisabled(true);
          ({ error, data } = await updateEmail({
            email,
            recaptchaCode,
          }));
        }

        setIsButtonDisabled(false);

        if (error !== undefined) {
          toast.error(error);
          return;
        }

        toast.success(data);
        onUpdate({ email });
      }

      if (!updated) {
        toast.success("Nothing to update!");
      }
    },
    [
      name,
      email,
      division,
      oldName,
      oldEmail,
      oldDivision,
      onUpdate,
      requestRecaptchaCode,
    ]
  );

  return (
    <div class="card">
      <div class="content p-4 w-80">
        <p class="title">Update Information</p>
        <p class="font-thin m-0">
          This will change how your team appears on the scoreboard. You may only
          change your team's name once every 10 minutes.
        </p>
        <div class="row u-center">
          <Form
            class={`col-12  `}
            onSubmit={doUpdate}
            disabled={isButtonDisabled}
            buttonText="Update"
          >
            <input
              required
              autocomplete="username"
              autocorrect="off"
              maxLength="64"
              minLength="2"
              icon={
                <i
                  class="fa fa-wrapper fa-circle-user"
                  style={{ fontSize: "28px" }}
                />
              }
              name="name"
              placeholder="Team Name"
              type="text"
              value={name}
              onChange={handleSetName}
            />
            <input
              autocomplete="email"
              autocorrect="off"
              icon={
                <i
                  class="fa fa-wrapper fa-envelope"
                  style={{ fontSize: "28px" }}
                />
              }
              name="email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={handleSetEmail}
            />
            <select
              icon={
                <i
                  class="fa fa-wrapper fa-address-book"
                  style={{ fontSize: "28px" }}
                />
              }
              class={`select  `}
              name="division"
              value={division}
              onChange={handleSetDivision}
            >
              <option value="" disabled>
                Division
              </option>
              {allowedDivisions.map((code) => {
                return (
                  <option key={code} value={code}>
                    {config.divisions[code]}
                  </option>
                );
              })}
            </select>
          </Form>
          {requestRecaptchaCode && <RecaptchaLegalNotice />}
        </div>
      </div>
    </div>
  );
};

const Profile = ({ uuid }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  const {
    name,
    email,
    division: divisionId,
    score,
    solves,
    teamToken,
    githubId,
    allowedDivisions,
  } = data;
  const division = config.divisions[data.division];
  const divisionPlace = util.strings.placementString(data.divisionPlace);
  const globalPlace = util.strings.placementString(data.globalPlace);

  const isPrivate = uuid === undefined || uuid === "me";

  useEffect(() => {
    setLoaded(false);
    if (isPrivate) {
      privateProfile().then(({ data, error }) => {
        if (error) {
          toast.error(error);
        } else {
          setData(data);
        }
        setLoaded(true);
      });
    } else {
      publicProfile(uuid).then(({ data, error }) => {
        if (error) {
          setError("Profile not found");
        } else {
          setData(data);
        }
        setLoaded(true);
      });
    }
  }, [uuid, isPrivate]);

  const onProfileUpdate = useCallback(
    ({ name, email, divisionId, githubId }) => {
      setData((data) => ({
        ...data,
        name: name === undefined ? data.name : name,
        email: email === undefined ? data.email : email,
        division: divisionId === undefined ? data.division : divisionId,
        githubId: githubId === undefined ? data.githubId : githubId,
      }));
    },
    []
  );

  useEffect(() => {
    document.title = `Profile | ${config.ctfName}`;
  }, []);

  if (!loaded) return null;

  if (error !== null) {
    return (
      <div class="row u-center">
        <div class="col-4">
          <div class={`card  `}>
            <div class="content p-4 w-80">
              <p class="title">There was an error</p>
              <p class="font-thin">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="u-flex u-gap-2 u-justify-center ml-2 mr-2 u-flex-column">
      {isPrivate && (
        <div>
          <UpdateCard
            {...{
              name,
              email,
              divisionId,
              allowedDivisions,
              onUpdate: onProfileUpdate,
            }}
          />
        </div>
      )}
      <div>
        <SummaryCard
          {...{
            name,
            score,
            division,
            divisionPlace,
            globalPlace,
            githubId,
            isPrivate,
          }}
        />
        {isPrivate ? (
          <PrivateSolvesCard solves={solves} />
        ) : (
          <PublicSolvesCard solves={solves} />
        )}
      </div>
    </div>
  );
};

export default Profile;
