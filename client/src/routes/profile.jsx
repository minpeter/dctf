import { useState, useCallback, useEffect } from "preact/hooks";
import { memo } from "preact/compat";
import config from "../config";

import {
  privateProfile,
  publicProfile,
  updateAccount,
  updateEmail,
  deleteEmail,
} from "../api/profile";
import { useToast } from "../components/toast";
import Form from "../components/form";
import MembersCard from "../components/profile/members-card";
import GithubCard from "../components/profile/github-card";
import {
  PublicSolvesCard,
  PrivateSolvesCard,
} from "../components/profile/solves-card";
import TokenPreview from "../components/token-preview";
import * as util from "../util";
import Trophy from "../icons/trophy.svg";
import AddressBook from "../icons/address-book.svg";
import UserCircle from "../icons/user-circle.svg";
import EnvelopeOpen from "../icons/envelope-open.svg";
import Rank from "../icons/rank.svg";
import Github from "../icons/github.svg";
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
              <Github style="height: 20px;" />
            </a>
          )}
        </div>
        <div class="action-bar">
          <p>
            <span class={`icon  `}>
              <img src={Trophy} />
            </span>
            {score === 0 ? "No points earned" : `${score} total points`}
          </p>
          <p>
            <span class={`icon  `}>
              <img src={Rank} />
            </span>
            {score === 0
              ? "Unranked"
              : `${divisionPlace} in the ${division} division`}
          </p>
          <p>
            <span class={`icon  `}>
              <img src={Rank} />
            </span>
            {score === 0 ? "Unranked" : `${globalPlace} across all teams`}
          </p>
          <p>
            <span class={`icon  `}>
              <img src={AddressBook} />
            </span>
            {division} division
          </p>
        </div>
      </div>
    </div>
  )
);

const TeamCodeCard = ({ teamToken }) => {
  const { toast } = useToast();

  const tokenUrl = `${location.origin}/login?token=${encodeURIComponent(
    teamToken
  )}`;

  const [reveal, setReveal] = useState(false);
  const toggleReveal = useCallback(() => setReveal(!reveal), [reveal]);

  const onCopyClick = useCallback(() => {
    if (navigator.clipboard) {
      try {
        navigator.clipboard.writeText(tokenUrl).then(() => {
          toast({ body: "Copied team invite URL to clipboard" });
        });
      } catch {}
    }
  }, [toast, tokenUrl]);

  return (
    <div class="card">
      <div class="content p-4 w-80">
        <p>Team Invite</p>
        <p class="font-thin">
          Send this team invite URL to your teammates so they can login.
        </p>

        <button
          onClick={onCopyClick}
          class={` btn--sm btn-info`}
          name="btn"
          value="submit"
          type="submit"
        >
          Copy
        </button>

        <button
          onClick={toggleReveal}
          class="btn-info btn--sm ml-1"
          name="btn"
          value="submit"
          type="submit"
        >
          {reveal ? "Hide" : "Reveal"}
        </button>

        {reveal && <TokenPreview token={tokenUrl} />}
      </div>
    </div>
  );
};

const UpdateCard = ({
  name: oldName,
  email: oldEmail,
  divisionId: oldDivision,
  allowedDivisions,
  onUpdate,
}) => {
  const { toast } = useToast();
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
          toast({ body: error, type: "error" });
          return;
        }

        toast({ body: "Profile updated" });

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
          toast({ body: error, type: "error" });
          return;
        }

        toast({ body: data });
        onUpdate({ email });
      }

      if (!updated) {
        toast({ body: "Nothing to update!" });
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
      toast,
      requestRecaptchaCode,
    ]
  );

  return (
    <div class="card">
      <div class="content p-4 w-80">
        <p>Update Information</p>
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
              icon={<img src={UserCircle} />}
              name="name"
              placeholder="Team Name"
              type="text"
              value={name}
              onChange={handleSetName}
            />
            <input
              autocomplete="email"
              autocorrect="off"
              icon={<img src={EnvelopeOpen} />}
              name="email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={handleSetEmail}
            />
            <select
              icon={<img src={AddressBook} />}
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
  const { toast } = useToast();

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
          toast({ body: error, type: "error" });
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
  }, [uuid, isPrivate, toast]);

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
    // width 782px 부터 flex 한줄로 정렬
    <div class="u-flex u-gap-2 u-justify-center ml-2 mr-2 u-flex-row-md u-flex-column">
      {isPrivate && (
        <div>
          <TeamCodeCard {...{ teamToken }} />
          <UpdateCard
            {...{
              name,
              email,
              divisionId,
              allowedDivisions,
              onUpdate: onProfileUpdate,
            }}
          />
          <GithubCard {...{ githubId, onUpdate: onProfileUpdate }} />
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
        {isPrivate && config.userMembers && <MembersCard />}
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
