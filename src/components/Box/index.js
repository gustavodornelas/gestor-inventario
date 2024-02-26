import { StyledBox} from "./style";

export default function Box(props) {
    return (
        <StyledBox>
            {props.children}
        </StyledBox>
    );
}
